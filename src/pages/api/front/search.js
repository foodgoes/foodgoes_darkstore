import { withSessionRoute } from '@/src/common/lib/withSession';
import dbConnect from '@/src/common/lib/dbConnect';
import Product from '@/src/common/models/Product';
import Search from '@/src/common/models/Search';
import User from '@/src/common/models/User';
import ResourceProduct from '@/src/common/resources/product';

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

    const userId = req.session.user ? req.session.user.id : null;
    const user = await User.findById(userId);

    const discountCode = user ? user.discount : 'new_user';

    const productIds = data.reduce((acc, d) => acc.concat(d.productIds), []);
    const filterProducts = {status: 'active', availableForSearch: true, '_id': {$in: productIds}};

    const options = {filter: filterProducts, projection: null, options: {skip: 0, limit: 35}, sort: [['availableForSale', 'desc'], ['sort', 'asc']]};
    const payload = {discountCode};
    const products = await ResourceProduct(options, payload);

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