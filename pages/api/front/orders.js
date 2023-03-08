import { v4 as uuidv4 } from 'uuid';

import { withSessionRoute } from "../../../lib/withSession";
import dbConnect from '../../../lib/dbConnect';
import Cart from '../../../models/Cart';
import Order from '../../../models/Order';
import User from '../../../models/User';
import Product from "@/models/Product";
import Location from "@/models/Location";
import {getFullDate} from '../../../utils/date';

import {getNextSequence} from '../../../lib/counter';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    const {id: userId} = req.session.user;
    if (!userId) {
      throw('Error, auth.');
    }

    const {cart: token, location: tokenLocation} = req.cookies;
    
    if (req.method === 'GET') {
      const orders = await handleGETAsync(userId, req.query);
      return res.status(200).json(orders);
    }

    if (req.method === 'POST') {
      const order = await handleBodyPOSTAsync(userId, token, tokenLocation, req.body);
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
    console.log(e);
      throw e;
  }
}
async function handleBodyPOSTAsync(userId, token, tokenLocation, body) {
  try {
    const guestLogged = body.guestLogged;

    const filterCart = !guestLogged ? {userId} : {token};
    const cart = await Cart.findOne(filterCart);
    if (!cart) {
      throw('error. Cart not found');
    }

    const filterLocation = !guestLogged ? {userId} : {token: tokenLocation};
    const location = await Location.findOne(filterLocation);
    if (!location) {
      throw('error. Location not found');
    }

    if (guestLogged) {
      const location = await Location.findOne({userId});
      if (!location) {
        await Location.findOneAndUpdate({token: tokenLocation}, {userId}, {new: true});
      }
    }

    const productIds = cart.products.map(p => p.productId);
    const products = await Product.find({'_id': {$in: productIds}});

    let totalLineItemsPrice = 0;
    let totalTax = 0;
    let totalShippingPrice = 25;
    let totalDiscounts = 0;
    let subtotalPrice = +(totalLineItemsPrice - totalDiscounts).toFixed(2);
    let totalPrice = +(totalLineItemsPrice + totalShippingPrice - totalDiscounts).toFixed(2);

    const lineItems = products.map(product => {
      const quantity = cart.products.find(p => String(p.productId) === product.id).quantity;

      totalLineItemsPrice += product.price*quantity;

      return {
        productId: product.id,
        title: product.title,
        brand: product.brand,
        price: product.price,
        quantity
      };
    });

    const shippingAddress = location.address;

    const seq = await getNextSequence('orderId');
    const tokenOrder = uuidv4();

    const newOrder = await Order.create({
      userId, 
      number: seq,
      orderNumber: 1000 + seq,
      token: tokenOrder,
      financialStatus: 'pending',
      fulfillmentStatus: 'pending_fulfillment',
      lineItems,
      shippingAddress,
      totalShippingPrice,
      totalTax,
      totalLineItemsPrice, 
      totalDiscounts,
      subtotalPrice,
      totalPrice,
    });

    return newOrder;
  } catch(e) {
    console.log(e);
      throw e;
  }
}