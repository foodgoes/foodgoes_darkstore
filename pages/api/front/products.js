import { withSessionRoute } from "../../../lib/withSession";
import dbConnect from '../../../lib/dbConnect';
import Product from '../../../models/Product';
import Collection from '../../../models/Collection';
import Category from '../../../models/Category';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    const {slug, slug2} = req.query;
    const products = [];
    let currentLinks = null;

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

      if (currentLinks.nestedLink) {
        if (currentLinks.nestedLink.subjectId) {
          const collection = await Collection.findById(currentLinks.nestedLink.subjectId);
          const {title, productIds} = collection;

          const dataProducts = await Product.find({status: 'active', '_id': {$in: productIds}}, null, {skip: 0, limit: 50}).sort([['sort', 'asc']]);
          dataProducts.forEach(product => {
            const images = product.images.map(img => process.env.UPLOAD_PRODUCTS+img);

            products.push({
              id: product.id,
              title: product.title,
              image: product.images && product.images.length ? process.env.UPLOAD_PRODUCTS+product.images[0] : null,
              images,
              price: product.price,
              compareAtPrice: product.compareAtPrice,
              pricePerUnit: product.pricePerUnit,
              brand: product.brand,
              quantity: product.quantity,
              weight: product.weight,
              weightPerUnit: product.weightPerUnit,
              weightUnit: product.weightUnit
            });
          });
        }
      }
    } else {
      const data = await Product.find({status: 'active'}, null, {skip: 0, limit: 50}).sort([['sort', 'asc']]);
      data.forEach(product => {
        const images = product.images.map(img => process.env.UPLOAD_PRODUCTS+img);

        products.push({
          id: product.id,
          title: product.title,
          image: product.images && product.images.length ? process.env.UPLOAD_PRODUCTS+product.images[0] : null,
          images,
          price: product.price,
          pricePerUnit: product.pricePerUnit,
          compareAtPrice: product.compareAtPrice,
          brand: product.brand,
          quantity: product.quantity,
          weight: product.weight,
          weightPerUnit: product.weightPerUnit,
          weightUnit: product.weightUnit
        });
      });
    }

    res.status(200).json({
      products,
      currentLinks
    });
  } catch(e) {
    console.log(e);
    res.status(200).json(null);
  }
}