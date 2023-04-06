import { withSessionRoute } from '@/src/lib/withSession';
import dbConnect from '@/src/lib/dbConnect';
import Product from '@/src/models/Product';
import Search from '@/src/models/Search';

export default withSessionRoute(handler);

async function handler(req, res) {
  let {q} = req.query;

  try {
    await dbConnect();  

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

    const regex = new RegExp("(?<=[-\\s,.:;\"']|^)" + q, 'i');
    const filter = {enabled: true, $or: [ { "keywords.en": regex }, { "keywords.he": regex }, { "keywords.ru": regex } ]};
    const data = await Search.find(filter, null, {skip: 0, limit: 20});
    if (!data || !data.length) {
      throw('Empty search');
    }
    const productIds = data.reduce((acc, d) => acc.concat(d.productIds), []);

    const filterProducts = {status: 'active', availableForSearch: true, '_id': {$in: productIds}};
    const dataProducts = await Product.find(filterProducts, null, {skip: 0, limit: 35}).sort([['sort', 'asc']]);
    const products = dataProducts.map(product => ({
      id: product.id,
      title: product.title,
      image: product.images && product.images.length ? process.env.UPLOAD_PRODUCTS+product.images[0] : null,
      images: product.images.map(img => process.env.UPLOAD_PRODUCTS+img),
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      brand: product.brand,
      weight: product.weight,
      weightUnit: product.weightUnit,
      unit: product.unit,
      amountPerUnit: product.amountPerUnit,
      displayAmount: product.displayAmount,
      availableForSale: product.availableForSale
    }));

    const count = await Product.countDocuments(filterProducts);

    res.status(200).json({
      products,
      phrase: q,
      count
    });
  } catch(e) {
    res.status(200).json({
      products: [],
      phrase: q,
      count: 0
    });
  }
}