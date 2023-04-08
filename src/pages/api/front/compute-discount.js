import { withSessionRoute } from '@/src/common/lib/withSession';
import dbConnect from '@/src/common/lib/dbConnect';
import Discount from '@/src/common/models/Discount';
import Cart from '@/src/common/models/Cart';
import Product from '@/src/common/models/Product';
import Order from '@/src/common/models/Order';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    const {id: userId} = req.session.user;
    if (!userId) {
      throw('Error, auth.');
    }

    if (req.method === 'GET') {
      const discount = await handleGETAsync(userId);
      return res.status(200).json(discount);
    }

    res.status(200).json(null);
  } catch(e) {
    res.status(200).json({totalDiscounts: 0});
  }
}

async function handleGETAsync(userId) {
  try {
    const data = await Discount.find(
      {status: 'active', startedAt: {$lt: new Date()}, finishedAt: {$gt: new Date()}}, null, 
      {skip: 0, limit: 30}).sort([['startedAt', 'desc']]);

    const discounts = [];
    for (let doc of data) {
      let isValidDiscount = false;
      const {conditions} = doc;

      for (let condition of conditions) {
        if (condition.orderCountEqual !== undefined && condition.orderCountEqual !== null) {
          const orderCount = await Order.countDocuments({userId});
          if (orderCount === condition.orderCountEqual) {
            isValidDiscount = true;
          }
        }
      }

      if (!isValidDiscount) {
        continue;
      }

      const discount = {
        id: doc.id,
        title: doc.title,
        previewDescription: doc.previewDescription,
        description: doc.description,
        ruleSet: doc.ruleSet,
        percentage: doc.percentage
      };

      discounts.push(discount);
    }
    const discount = discounts[0];

    const cart = await Cart.findOne({userId});
    if (!cart) {
      throw('cart is empty');
    }

    const productIds = cart.products.map(p => String(p.productId));
    const products = await Product.find({'_id': {$in: productIds}});

    let totalDiscounts = 0;
    for (let product of products) {
      const index = productIds.indexOf(product.id);
      if (index === -1) {
        continue;
      }
      const quantity = cart.products[index].quantity;
      
      const {ruleSet} = discount;
      for (let rule of ruleSet.rules) {
          const {column, relation, condition} = rule;
          if (column === 'compare_at_price' && relation === 'equals' && parseFloat(condition) === product.compareAtPrice) {
            totalDiscounts += (discount.percentage * (product.price*quantity)) / 100;
          }
      }
    }

    totalDiscounts = +totalDiscounts.toFixed(2);

    return {totalDiscounts};
  } catch(e) {
      throw e;
  }
}