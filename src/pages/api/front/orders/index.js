import { v4 as uuidv4 } from 'uuid';

import { withSessionRoute } from '@/src/common/lib/withSession';
import dbConnect from '@/src/common/lib/dbConnect';
import {getNextSequence} from '@/src/common/lib/counter';
import Cart from '@/src/common/models/Cart';
import Order from '@/src/common/models/Order';
import User from '@/src/common/models/User';
import Product from '@/src/common/models/Product';
import Location from '@/src/common/models/Location';
import Discount from '@/src/common/models/Discount';
import {getDateV2} from '@/src/common/utils/date';

import { validateString, validateBoolean } from '@/src/common/utils/validators';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    const {id: userId} = req.session.user;
    if (!userId) {
      throw(new Error('Error, auth.'));
    }

    if (req.method === 'GET') {
      const orders = await handleGETAsync(userId, req.query);
      return res.status(200).json(orders);
    }

    if (req.method === 'POST') {
      const order = await handleBodyPOSTAsync(userId, req, res);
      return res.status(200).json(order);
    }

    res.status(200).json([]);
  } catch(e) {
    res.status(200).json([]);
  }
}

async function handleGETAsync(userId) {
  try {
      const user = await User.findById(userId);
      if (!user) {
        throw(new Error('User not exist'));
      }

      const output = [];

      const orders = await Order.find({userId}, null, {skip: 0, limit: 35}).sort([['createdAt', 'desc']]);
      for(let order of orders) {
        const date = getDateV2(order.createdAt);

        const productIds = order.lineItems.map(i => i.productId);
        const products = await Product.find({'_id': {$in: productIds}});
        const lineItems = order.lineItems.map(item => {
          const product = products.find(p => p.id === String(item.productId));
          const images = product.images.map(img => ({
            src: img.src,
            srcWebp: img.srcWebp,
            width: img.width,
            height: img.height,
            alt: img.alt
          }));

          return {
            id: item.id,
            title: item.title,
            brand: item.brand,
            price: item.price,
            quantity: item.quantity,
            productId: item.productId,
            images,
            image: images.length ? images[0] : null
          };
        });

        let status = 'pending';
        if (order.financialStatus === 'paid' && order.fulfillmentStatus === 'fulfilled') {
          status = 'completed';
        }
        if (order.cancelledAt) {
          status = 'canceled';
        }

        output.push({
          id: order.id,
          orderNumber: order.orderNumber,
          token: order.token,
          totalShippingPrice: order.totalShippingPrice,
          totalTax: order.totalTax,
          totalLineItemsPrice: order.totalLineItemsPrice,
          totalDiscounts: order.totalDiscounts,
          subtotalPrice: order.subtotalPrice,
          totalPrice: order.totalPrice,
          financialStatus: order.financialStatus,
          fulfillmentStatus: order.fulfillmentStatus,
          lineItems,
          shippingAddress: order.shippingAddress,
          createdAt: order.createdAt,
          date,
          status
        });
      }

      return output;
  } catch(e) {
      throw e;
  }
}
async function handleBodyPOSTAsync(userId, req, res) {
  try {
    const orderBody = req.body;

    const {errors: errorsForm, data: validatedData} = (function(data) {
      try {
        const errors = [];
        const output = {};

        output.shippingAddress = (function() {
          const outputShippingAddress = {};

          if (data.hasOwnProperty('shippingAddress')) {
              const {shippingAddress} = data;

              const {address1} = shippingAddress;
              const [errorsAddress1, valueAddress1] = validateString(address1, {require: true, max: 550});
              if (errorsAddress1.length > 0) {
                  errors.push({field: ['shippingAddress', 'address1'], message: errorsAddress1[0]});
              }
              outputShippingAddress.address1 = valueAddress1;

              if (shippingAddress.hasOwnProperty('address2')) {
                const {address2} = shippingAddress;
                const [errorsAddress2, valueAddress2] = validateString(address2, {max: 550});
                if (errorsAddress2.length > 0) {
                    errors.push({field: ['shippingAddress', 'address2'], message: errorsAddress2[0]});
                }
                outputShippingAddress.address2 = valueAddress2;
              }
              if (shippingAddress.hasOwnProperty('entrance')) {
                  const {entrance} = shippingAddress;
                  const [errorsEntrance, valueEntrance] = validateString(entrance, {max: 100});
                  if (errorsEntrance.length > 0) {
                      errors.push({field: ['shippingAddress', 'entrance'], message: errorsEntrance[0]});
                  }
                  outputShippingAddress.entrance = valueEntrance;
              }
              if (shippingAddress.hasOwnProperty('floor')) {
                  const {floor} = shippingAddress;
                  const [errorsFloor, valueFloor] = validateString(floor, {max: 5});
                  if (errorsFloor.length > 0) {
                      errors.push({field: ['shippingAddress', 'floor'], message: errorsFloor[0]});
                  }
                  outputShippingAddress.floor = valueFloor;
              }
              if (shippingAddress.hasOwnProperty('doorcode')) {
                  const {doorcode} = shippingAddress;
                  const [errorsDoorcode, valueDoorcode] = validateString(doorcode, {max: 10});
                  if (errorsDoorcode.length > 0) {
                      errors.push({field: ['shippingAddress', 'doorcode'], message: errorsDoorcode[0]});
                  }
                  outputShippingAddress.doorcode = valueDoorcode;
              }
              if (shippingAddress.hasOwnProperty('comment')) {
                  const {comment} = shippingAddress;
                  const [errorsComment, valueComment] = validateString(comment, {max: 650});
                  if (errorsComment.length > 0) {
                      errors.push({field: ['shippingAddress', 'comment'], message: errorsComment[0]});
                  }
                  outputShippingAddress.comment = valueComment;
              }
              if (shippingAddress.hasOwnProperty('options')) {
                const {options} = shippingAddress;
                outputShippingAddress.options = {};
                if (shippingAddress.options) {
                    if (options.hasOwnProperty('leaveAtTheDoor')) {
                      const {leaveAtTheDoor} = options;
                      const [errorsLeaveAtTheDoor, valueLeaveAtTheDoor] = validateBoolean(leaveAtTheDoor);
                      if (errorsLeaveAtTheDoor.length > 0) {
                          errors.push({field: ['options', 'leaveAtTheDoor'], message: errorsLeaveAtTheDoor[0]});
                      }
                      outputShippingAddress.options.leaveAtTheDoor = valueLeaveAtTheDoor;
                    }
                }
            }
          }

          return outputShippingAddress;
        })();

        return {errors, data: output};
      } catch(e) {
        return {errors: [{message: e.message}]};
      }
    })(orderBody);
    if (Object.keys(errorsForm).length > 0) {
      return {
        order: null,
        userErrors: errorsForm
      };
    }

    const {errors: errorsDB, data: savedData} = await (async function(data, payload) {
      try {
        const {userId} = payload;

        const errors = [];
        const output = {};

        if (!userId) {
          throw(new Error('userId not found'));
        }

        const cart = await Cart.findOne({userId}).sort({_id: -1});
        if (!cart) {
          throw(new Error('Cart not found'));
        }

        const location = await Location.findOne({userId}).sort({_id: -1});
        if (!location) {
          throw(new Error('Location not found'));
        }

        const productIds = cart.products.map(p => p.productId);
        const products = await Product.find({'_id': {$in: productIds}});

        let totalWeight = 0;
        let totalLineItemsPrice = 0;
        const lineItems = products.map(product => {
          const quantity = cart.products.find(p => String(p.productId) === product.id).quantity;
          totalLineItemsPrice += product.price*quantity;
          totalWeight += product.grams*quantity;

          return {
            productId: product.id,
            title: product.title,
            brand: product.brand,
            price: product.price,
            unitCost: product.unitCost,
            compareAtPrice: product.compareAtPrice,
            pricePerUnit: product.pricePerUnit,
            unit: product.unit,
            amountPerUnit: product.amountPerUnit,
            displayAmount: product.displayAmount,
            quantity,
            grams: product.grams,
          };
        });
        totalLineItemsPrice = +totalLineItemsPrice.toFixed(2);
        totalWeight = +totalWeight.toFixed(0);

        const totalTax = 0;
        const totalDiscounts = 0;
        const totalShippingPrice = 30;
        const subtotalPrice = +(totalLineItemsPrice - totalDiscounts).toFixed(2);
        const totalPrice = +(subtotalPrice + totalShippingPrice).toFixed(2);
        const minTotalPrice = 50;
    
        if (totalPrice < minTotalPrice) {
          throw(new Error('Minimum total price is ' + minTotalPrice));
        }

        if (errors.length > 0) {
          return {errors};
        }

        const seq = await getNextSequence('orderId');
        const order = await Order.create({
          ...data,
          userId, 
          number: seq,
          orderNumber: 1000 + seq,
          token: uuidv4(),
          financialStatus: 'pending',
          lineItems,
          totalShippingPrice,
          totalTax,
          totalLineItemsPrice, 
          totalDiscounts,
          subtotalPrice,
          totalPrice,
          totalWeight
        });
        if (!order) {
          throw(new Error('Failed to add order'));
        }

        const {id: orderId} = order;
        output.orderId = orderId;

        await Cart.findOneAndRemove({userId});
        res.setHeader('Set-Cookie', 'cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;');

        await Location.findOneAndUpdate({userId}, {address: data.shippingAddress});

        // send alert of new order to admin dashboard
        const response = await fetch(process.env.DOMAIN + '/admin/api/orders', {method: 'POST',  headers: {
          'Content-Type': 'application/json',
        }, body: JSON.stringify({id: orderId})});
        await response.json();

        return {errors, data: output};
      } catch (e) {
        return {errors: [{message: e.message}]};
      }
    })(validatedData, {userId});
    if (Object.keys(errorsDB).length > 0) {
      return {
        order: null,
        userErrors: errorsDB
      };
    }

    const {errors: errorsRes, data: obtainedData} = await (async function(data, payload) {
      try {
          const errors = [];
          const output = {};

          const {orderId} = data;
          const {userId} = payload;

          const order = await Order.findOne({orderId, userId});
          if (!order) {
            throw(new Error('Order not found'));
          }

          output.order = {
            id: orderId,
            orderNumber: order.orderNumber,
            token: order.token,
            totalShippingPrice: order.totalShippingPrice,
            totalTax: order.totalTax,
            totalLineItemsPrice: order.totalLineItemsPrice,
            totalDiscounts: order.totalDiscounts,
            subtotalPrice: order.subtotalPrice,
            totalPrice: order.totalPrice,
            financialStatus: order.financialStatus,
            fulfillmentStatus: order.fulfillmentStatus,
            lineItems: order.lineItems,
            shippingAddress: order.shippingAddress,
            createdAt: order.createdAt
          };

          return {errors, data: output};
      } catch (e) {
          return {errors: [{message: e.message}]};
      }
    })(savedData, {userId});
    if (Object.keys(errorsRes).length > 0) {
        return {
          order: null,
          userErrors: errorsRes
        }
    }

    return {
      order: obtainedData.order,
      userErrors: []
    };
  } catch(e) {
    throw e;
  }
}