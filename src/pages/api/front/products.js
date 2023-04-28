import { withSessionRoute } from '@/src/common/lib/withSession';
import dbConnect from '@/src/common/lib/dbConnect';
import Collection from '@/src/common/models/Collection';
import Category from '@/src/common/models/Category';
import User from '@/src/common/models/User';
import ResourceProduct from '@/src/common/resources/product';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    const userId = req.session.user ? req.session.user.id : null;
    const user = await User.findById(userId);

    const discountCode = user ? user.discount : 'new_user';

    const {slug, slug2} = req.query;
    let currentLinks = null;

    const filter = {status: 'active'};

    if (slug && slug2) {
      const getLinkBySlug = (slug, links) => {
        let res = null;

        links.forEach(l => {
          if (slug === l.handle) res = l;
        });

        return res;
      };

      const dataCategory = await Category.find({enabled: true}, null, {skip: 0, limit: 50});
      dataCategory.forEach(doc => {
        const l = getLinkBySlug(slug, doc.links);
        if (l) {
          const l2 = getLinkBySlug(slug2, l.links);
          currentLinks = {
            baseLink: doc,
            link: l,
            nestedLink: l2
          };
        }
      });

      if (currentLinks.nestedLink && currentLinks.nestedLink.subjectId) {
        const {productIds} = await Collection.findById(currentLinks.nestedLink.subjectId);
        filter['_id'] = {$in: productIds};
      }
    }

    const options = {filter, projection: null, options: {skip: 0, limit: 400}, sort: [['availableForSale', 'desc'], ['sort', 'asc']]};
    const payload = {discountCode};
    const products = await ResourceProduct(options, payload);

    res.status(200).json({
      products,
      currentLinks
    });
  } catch(e) {
    res.status(200).json({
      products: [],
      currentLinks: null
    });
  }
}