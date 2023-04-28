import { v4 as uuidv4 } from 'uuid';
import { withSessionRoute } from '@/src/common/lib/withSession';
import dbConnect from '@/src/common/lib/dbConnect';
import Cart from '@/src/common/models/Cart';
import Product from '@/src/common/models/Product';
import Discount from '@/src/common/models/Discount';
import User from '@/src/common/models/User';
import ResourceProduct from '@/src/common/resources/product';
import {getPrice} from '@/src/common/utils/currency';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    if (req.method === 'GET') {
      const cart = await handleGETAsync(req);
      return res.status(200).json(cart);
    }

    if (req.method === 'POST') {
      const cart = await handleBodyPOSTAsync(req, res);
      if (!req.cookies.cart) {
        const d = new Date();
        d.setTime(d.getTime() + (7*24*60*60*1000));
        const expires = "expires="+ d.toUTCString();
        res.setHeader('Set-Cookie', `cart=${cart.token}; ${expires}; path=/`);
      }
      return res.status(200).json(cart);
    }

    if (req.method === 'DELETE') {
      const cart = await handleBodyDELETEAsync(req);
      res.setHeader('Set-Cookie', 'cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;');

      return res.status(200).json({deletedCartId: cart.id});
    }

    res.status(200).json({
      totalPrice: 0,
      products: []
    });
  } catch(e) {
    res.status(200).json({
      totalPrice: 0,
      products: []
    });
  }
}

async function handleGETAsync(req) {
  try {
    const userId = req.session.user ? req.session.user.id : null;
    const token = req.cookies.cart;

    const cart = await (async function(userId, token) {
      try {
        const cartByToken = await Cart.findOne({token});
        if (!cartByToken) {
          return await Cart.findOne({userId: {$and: [{ $ne: null }, {$eq: userId}]}});
        }
        return cartByToken;
      } catch(e) {
        return null;
      }
    }(userId, token));
    if (!cart) {
      throw('Cart not exist');
    }

    const user = await User.findById(userId);
    const discountCode = user ? user.discount : 'new_user';

    const productIds = cart.products.map(p => p.productId);

    const filter = {status: 'active', '_id': {$in: productIds}};
    const sort = [['availableForSale', 'desc'], ['sort', 'asc']];
    const options = {filter, projection: null, options: {skip: 0, limit: 400}, sort};
    const payload = {discountCode};

    const productsV2 = await ResourceProduct(options, payload);

    return {
      id: cart.id,
      userId: cart.userId,
      totalShippingPrice: cart.totalShippingPrice,
      totalLineItemsPrice: cart.totalLineItemsPrice,
      totalDiscounts: cart.totalDiscounts,
      subtotalPrice: cart.subtotalPrice,
      totalPrice: cart.totalPrice,
      products: cart.products,
      productsV2
    };
  } catch(e) {
    throw e;
  }
}
async function handleBodyPOSTAsync(req, res) {
  try {
    const userId = req.session.user ? req.session.user.id : null;
    const token = req.cookies.cart || uuidv4();
    const {productId, action} = req.body;

    const user = await User.findById(userId);
    const discountCode = user ? user.discount : 'new_user';

    const cart = await (async function(userId, token) {
      try {
        const cartByToken = await Cart.findOne({token});
        if (!cartByToken) {
          return await Cart.findOne({$and: [{ userId: {$ne: null} }, { userId }]});
        }
        return cartByToken;
      } catch(e) {
        return null;
      }
    }(userId, token));

    const products = (function(productId, action, products) {
      if (productId) {
        const product = products.find(p => p.productId.toString() === productId);
        if (!product) {
          return products.concat({productId, quantity: 1});
        }
  
        const quantity = (function(quantity, action) {
          if (action === 'inc') return quantity + 1;
          if (action === 'dec') return quantity - 1;
          return quantity;
        })(product.quantity, action);
  
        if (quantity < 1) {
          return products.filter(p => p.productId.toString() !== productId);
        }

        return products.map(p => ({
          _id: p._id,
          productId: p.productId,
          quantity: p.productId.toString() === productId ? quantity : p.quantity
      }));
      }

      return products;
    })(productId, action, cart ? cart.products : []);

    if (!products.length) {
      await Cart.findByIdAndRemove(cart.id);
      res.setHeader('Set-Cookie', 'cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;');

      return {
        totalPrice: 0,
        products: []
      };
    }

    const totals = await (async function(productsCart) {
      let totalShippingPrice = 30;
      let totalLineItemsPrice = 0;
      let totalDiscounts = 0;
      let subtotalPrice = 0;
      let totalPrice = 0;
      let minTotalPrice = 0;

      const productIds = productsCart.map(p => p.productId);
      if (!productIds.length) {
        throw('no products in cart')
      }

      const productsFromDB = await Product.find({_id: {$in: productIds}, status: 'active'}, 'price');
      if (!productsFromDB.length) {
        throw('no products in DB')
      }

      const discount = await Discount.findOne(
        {
          status: 'active', code: discountCode, 
          startedAt: {$lt: new Date()}, finishedAt: {$gt: new Date()}
        }
      );
      
      for (let productCart of productsCart) {
        const {productId, quantity} = productCart;

        const product = productsFromDB.find(p => p.id === productId.toString());
        const price = product ? product.price : 0;

        totalLineItemsPrice += price*quantity;

        if (discount) {
          const custom = discount.products.custom.find(c => c.productId.toString() === productId.toString());
          if (custom) {
            if (custom.percentage) {
              totalDiscounts += price*quantity*custom.percentage/100;
            }
            if (custom.amount) {
              const q = quantity % custom.quantity === 0 ? quantity : quantity - 1;
              if (q) {
                totalDiscounts += custom.amount*(q/custom.quantity); 
              }
            }
          } else if (discount.products.all.enabled) {
            if (!discount.products.all.excludeProductIds.includes(productId)) {
              totalDiscounts += price*quantity*discount.products.all.percentage/100;
            }
          }
  
          if (discount.shipping.all.enabled) {
            totalShippingPrice -= totalShippingPrice*discount.shipping.all.percentage/100;
          }
          if (discount.order.minTotalPrice) {
            minTotalPrice = discount.order.minTotalPrice;
          }
        }
      }

      totalLineItemsPrice = getPrice(totalLineItemsPrice);
      totalDiscounts = getPrice(totalDiscounts);
      subtotalPrice = getPrice(totalLineItemsPrice - totalDiscounts);
      totalPrice = getPrice(subtotalPrice + totalShippingPrice);
      minTotalPrice = getPrice(minTotalPrice);

      return {totalShippingPrice, totalLineItemsPrice, totalDiscounts, subtotalPrice, totalPrice, minTotalPrice};
    })(products);

    const productsV2 = await (async function(productsCart) {
      const productIds = productsCart.map(p => p.productId);
      const filter = {status: 'active', '_id': {$in: productIds}};
      const sort = [['availableForSale', 'desc'], ['sort', 'asc']];
      const options = {filter, projection: null, options: {skip: 0, limit: 400}, sort};
      const payload = {discountCode};
      return await ResourceProduct(options, payload);
    })(products);

    const updCart = await (async function(token, isCart, payload) {
      if (isCart) {
        return await Cart.findByIdAndUpdate(cart.id, {...payload, token, updatedAt: Date.now()}, {new: true});
      }

      return await Cart.create({...payload, token});
    })(token, !!cart, {...totals, products, userId});

    return {
      id: updCart.id,
      token: updCart.token,
      userId: updCart.userId,
      totalShippingPrice: updCart.totalShippingPrice,
      totalLineItemsPrice: updCart.totalLineItemsPrice,
      totalDiscounts: updCart.totalDiscounts,
      subtotalPrice: updCart.subtotalPrice,
      totalPrice: updCart.totalPrice,
      minTotalPrice: updCart.minTotalPrice,
      products: updCart.products,
      productsV2
    };
  } catch(e) {
    throw e;
  }
}
async function handleBodyDELETEAsync(req) {
  try {
    const {id} = req.query;
    const cart = await Cart.findOneAndRemove({_id: id});
    if (!cart) {
      throw('cart error');
    }

    return cart;
  } catch(e) {
      throw e;
  }
}