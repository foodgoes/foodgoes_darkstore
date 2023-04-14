import { v4 as uuidv4 } from 'uuid';
import { withSessionRoute } from '@/src/common/lib/withSession';
import dbConnect from '@/src/common/lib/dbConnect';
import Cart from '@/src/common/models/Cart';
import Product from '@/src/common/models/Product';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    if (req.method === 'GET') {
      const cart = await handleGETAsync(req);
      return res.status(200).json(cart);
    }

    if (req.method === 'POST') {
      const cart = await handleBodyPOSTAsync(req);
      if (!req.cookies.cart) {
        const d = new Date();
        d.setTime(d.getTime() + (7*24*60*60*1000));
        const expires = "expires="+ d.toUTCString();
        res.setHeader('Set-Cookie', `cart=${cart.token}; ${expires}; path=/`);
      }
      setTimeout((() => {
        res.status(200).json(cart);
      }), 500);
      return;
    }

    if (req.method === 'DELETE') {
      const cart = await handleBodyDELETEAsync(req);
      res.setHeader('Set-Cookie', 'cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;');

      return res.status(200).json({deletedCartId: cart.id});
    }

    res.status(200).json({
      total: 0,
      products: []
    });
  } catch(e) {
    res.status(200).json({
      total: 0,
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

    const productIds = cart.products.map(p => p.productId);
    const products = await Product.find({'_id': {$in: productIds}});
    const productsCart = products.map(product => {
      const images = product.images.map(img => ({
        src: img.src,
        srcWebp: img.srcWebp,
        width: img.width,
        height: img.height,
        alt: img.alt
      }));
      
      return {
        id: product.id,
        productId: product.id,
        title: product.title,
        image: images.length ? images[0] : null,
        images,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        brand: product.brand,
        quantity: cart.products.find(p => String(p.productId) === product.id).quantity,
        excludeDiscount: product.excludeDiscount,
        ageRestricted: product.ageRestricted
      };
    });

    return {
      id: cart.id,
      userId: cart.userId,
      total: cart.total,
      products: cart.products,
      productsV2: productsCart || []
    };
  } catch(e) {
      throw e;
  }
}
async function handleBodyPOSTAsync(req) {
  try {
    const userId = req.session.user ? req.session.user.id : null;
    const token = req.cookies.cart || uuidv4();
    const {productId, action} = req.body;

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

    const {total, products, productsV2} = await (async function(productId, action, cart) {
      try {
        const product = await Product.findById(productId);
        if (!product) {
          throw("Product not found");
        }

        const total = (function(total, price, action) {
          if (action === 'inc') total = total + price;
          if (action === 'dec') total = total - price;
          return +(total.toFixed(2));
        })(cart ? cart.total : 0, product.price, action);

        const products = (function(products, productId, action) {
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
        })(cart ? cart.products : [], productId, action);

        const productsV2 = await (async function(products) {
          const productIds = products.map(p => p.productId);
          const productsList = await Product.find({'_id': {$in: productIds}});
          return productsList.map(product => {
            const images = product.images.map(img => ({
              src: img.src,
              srcWebp: img.srcWebp,
              width: img.width,
              height: img.height,
              alt: img.alt
            }));
    
            return {
              id: product.id,
              productId: product.id,
              title: product.title,
              image: images.length ? images[0] : null,
              images,
              price: product.price,
              compareAtPrice: product.compareAtPrice,
              brand: product.brand,
              quantity: products.find(p => String(p.productId) === product.id).quantity,
              excludeDiscount: product.excludeDiscount,
              ageRestricted: product.ageRestricted
            };
          });
        })(products);
  
        return {total, products, productsV2};
      } catch(e) {
        throw e;
      }
    }(productId, action, cart));

    const updCart = await (async function(obj, token, userId, cart) {
      if (!cart) {
        return await Cart.create({...obj, token, userId});
      } else {
        if (!cart.userId) {
          obj.userId = userId;
        }
        return await Cart.findByIdAndUpdate(cart.id, {...obj, token, updatedAt: Date.now()}, {new: true});
      }
    })({total, products}, token, userId, cart);

    return {
      id: updCart.id,
      token, userId,
      total, products, productsV2,
    };
  } catch(e) {
    console.log(e)
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