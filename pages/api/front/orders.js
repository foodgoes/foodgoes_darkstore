import { withSessionRoute } from "../../../lib/withSession";
import dbConnect from '../../../lib/dbConnect';
import Order from '../../../models/Order';
import User from '../../../models/User';
import {getFullDate} from '../../../utils/date';
import Product from "@/models/Product";

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

    if (req.method === 'POST') {
      const order = await handleBodyPOSTAsync(userId, req.body);
      return res.status(200).json(order);
    }

    res.status(200).json(null);
  } catch(e) {
    res.status(200).json(null);
  }
}

async function handleGETAsync(userId, query) {
  try {
      const {userId: externalId} = query;

      const user = await User.findOne({'providers.firebase.externalId': externalId});
      if (!user) {
        throw('User not exist');
      }

      if (user.id !== userId) {
        throw('User not match');
      }

      const output = [];

      const orders = await Order.find({userId}, null, {skip: 0, limit: 35}).sort([['createdAt', 'desc']]);
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
    console.log(e);
      throw e;
  }
}
async function handleBodyPOSTAsync(userId, body) {
  try {
      const {userId: externalId, data} = body;

      const user = await User.findOne({'providers.firebase.externalId': externalId});
      if (!user) {
        throw('User not exist');
      }

      if (user.id !== userId) {
        throw('User not match');
      }

      const lineItems = data.lineItems.map(lineItem => ({
        productId: lineItem.id,
        quantity: lineItem.quantity,
        price: lineItem.price,
        title: lineItem.title,
        brand: lineItem.brand,
      }));

      const newOrder = await Order.create({
        userId, 
        financialStatus: data.financialStatus,
        fulfillmentStatus: data.fulfillmentStatus,
        totalShippingPrice: data.totalShippingPrice,
        totalTax: data.totalTax,
        totalLineItemsPrice: data.totalLineItemsPrice, 
        totalDiscounts: data.totalDiscounts,
        subtotalPrice: data.subtotalPrice,
        totalPrice: data.totalPrice,
        lineItems,
      });

      return newOrder;
  } catch(e) {
    console.log(e);
      throw e;
  }
}