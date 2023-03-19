import { withSessionRoute } from "../../../lib/withSession";
import dbConnect from '../../../lib/dbConnect';
import Product from '../../../models/Product';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    let {q, locale} = req.query;

    if (q === null || q === undefined) {
      throw 'invalid query';
    }

    q = q.trim();
    if (q === '') {
      throw 'Empty query';
    }

    const qLength = q.length;
    if (qLength < 3) {
      throw 'Minimum 3 symbols';
    }
    if (qLength > 50) {
      throw 'Maximum 10 symbols';
    }

    q = q.toLowerCase();

    const regex = new RegExp(q, 'i');
    const title = `title.${locale}`;
    const filter = {status: 'active', [title]: regex};
    const data = await Product.find(filter, null, {skip: 0, limit: 35}).sort([['sort', 'asc']]);

    const products = data.map(product => ({
      id: product.id,
      title: product.title,
      image: product.images && product.images.length ? process.env.UPLOAD_PRODUCTS+product.images[0] : null,
      images: product.images.map(img => process.env.UPLOAD_PRODUCTS+img),
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      brand: product.brand,
      quantity: product.quantity,
      weight: product.weight,
      weightUnit: product.weightUnit,
      unit: product.unit,
      amountPerUnit: product.amountPerUnit,
      displayAmount: product.displayAmount
    }));

    const count = await Product.countDocuments(filter);

    res.status(200).json({
      products,
      phrase: q,
      count
    });
  } catch(e) {
    res.status(200).json(null);
  }
}