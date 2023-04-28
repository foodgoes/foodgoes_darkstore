import { withSessionRoute } from '@/src/common/lib/withSession';
import dbConnect from '@/src/common/lib/dbConnect';
import Product from '@/src/common/models/Product';
import Order from '@/src/common/models/Order';
import {getDateV2} from '@/src/common/utils/date';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    const userId = req.session.user.id;
    const {orderId} = req.query;

    const order = await Order.findOne({_id: orderId, userId});
    if (!order) {
      throw("not found order");
    }

    const date = getDateV2(order.createdAt);
    const canceledDate = order.canceledAt ? getDateV2(order.canceledAt) : null;

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
        image: images.length ? images[0] : null,
        displayAmount: item.displayAmount,
        unit: item.unit
      };
    });

    const shippingAddress = {
      address1: order.shippingAddress.address1
    };

    res.status(200).json({
      order: {
        id: order.id,
        date,
        canceledDate,
        orderNumber: order.orderNumber,
        lineItems,
        shippingAddress,
        totalShippingPrice: order.totalShippingPrice,
        subtotalPrice: order.subtotalPrice,
        totalPrice: order.totalPrice
      }
    });
  } catch(e) {
    res.status(500).json({ error: 'failed to load data', order: {} });
  }
}