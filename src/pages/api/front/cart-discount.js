import { withSessionRoute } from '@/src/common/lib/withSession';
import dbConnect from '@/src/common/lib/dbConnect';
import Cart from '@/src/common/models/Cart';
import Product from '@/src/common/models/Product';
import Discount from '@/src/common/models/Discount';
import User from '@/src/common/models/User';
import {getPrice} from '@/src/common/utils/currency';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    if (req.method === 'POST') {
      const cart = await handleBodyPOSTAsync(req, res);
      return res.status(200).json(cart);
    }

    res.status(200).json({
      totalPrice: 0
    });
  } catch(e) {
    res.status(200).json({
      totalPrice: 0
    });
  }
}

async function handleBodyPOSTAsync(req, res) {
  try {
    const userId = req.session.user ? req.session.user.id : null;
    const token = req.cookies.cart;

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
    if (!cart) {
      throw('Cart not found');
    }

    const discountChanged = await (async function(productsCart, totalPriceCart, minTotalPriceCart) {
      try {
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
  
        return totalPrice !== totalPriceCart || minTotalPrice !== minTotalPriceCart;
      } catch(e) {
        throw(e);
      }
    })(cart ? cart.products : [], cart ? cart.totalPrice : 0, cart ? cart.minTotalPrice : 0);

    return discountChanged;
  } catch(e) {
    return false;
  }
}