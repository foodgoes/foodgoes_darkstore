import { withSessionRoute } from '@/src/common/lib/withSession';
import dbConnect from '@/src/common/lib/dbConnect';
import Order from '@/src/common/models/Order';
import User from '@/src/common/models/User';
import Product from '@/src/common/models/Product';
import {getFullDate} from '@/src/common/utils/date';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    const {id: userId} = req.session.user;
    if (!userId) {
      throw('Error, auth.');
    }
    
    if (req.method === 'GET') {
      const orders = await handleGETAsync(userId, req.query);
      return res.status(200).json(orders);
    }

    res.status(200).json(null);
  } catch(e) {
    res.status(200).json(null);
  }
}

async function handleGETAsync(userId) {
  try {
      const user = await User.findById(userId);
      if (!user) {
        throw('User not exist');
      }
      if (!user.isAdmin) {
        throw('User is not admin');
      }

      const output = [];

      const orders = await Order.find({}, null, {skip: 0, limit: 10}).sort([['createdAt', 'desc']]);
      for(let order of orders) {
        const date = getFullDate(order.createdAt);

        const productIds = order.lineItems.map(i => i.productId);
        const products = await Product.find({'_id': {$in: productIds}});

        const lineItems = order.lineItems.map(item => {
          const images = products.find(p => p.id === String(item.productId)).images;

          return {
            id: item.id,
            title: item.title,
            brand: item.brand,
            price: item.price,
            quantity: item.quantity,
            productId: item.productId,
            images: images.map(img => process.env.UPLOAD_PRODUCTS+img),
            image: images.length ? process.env.UPLOAD_PRODUCTS+images[0] : null
          };
        });

        output.push({
          id: order.id,
          orderNumber: order.orderNumber,
          date,
          financialStatus: order.financialStatus,
          fulfillmentStatus: order.fulfillmentStatus,
          totalShippingPrice: order.totalShippingPrice,
          totalTax: order.totalTax,
          totalLineItemsPrice: order.totalLineItemsPrice, 
          totalDiscounts: order.totalDiscounts,
          subtotalPrice: order.subtotalPrice,
          totalPrice: order.totalPrice,
          lineItems,
        });
      }

      return output;
  } catch(e) {
      throw e;
  }
}