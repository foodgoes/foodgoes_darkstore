import { withSessionRoute } from '@/src/common/lib/withSession';
import dbConnect from '@/src/common/lib/dbConnect';
import Product from '@/src/common/models/Product';
import Collection from '@/src/common/models/Collection';
import Category from '@/src/common/models/Category';

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

          const dataProducts = await Product.find({status: 'active', '_id': {$in: productIds}}, null, {skip: 0, limit: 400}).sort([['availableForSale', 'desc'], ['sort', 'asc']]);
          dataProducts.forEach(product => {
            const images = product.images.map(img => process.env.UPLOAD_PRODUCTS+img);

            products.push({
              id: product.id,
              title: product.title,
              image: product.images && product.images.length ? process.env.UPLOAD_PRODUCTS+product.images[0] : null,
              images,
              brand: product.brand,
              price: product.price,
              compareAtPrice: product.compareAtPrice,
              pricePerUnit: product.pricePerUnit,
              quantity: product.quantity,
              weight: product.weight,
              weightUnit: product.weightUnit,
              unit: product.unit,
              amountPerUnit: product.amountPerUnit,
              displayAmount: product.displayAmount,
              availableForSale: product.availableForSale
            });
          });
        }
      }
    } else {
      const data = await Product.find({status: 'active'}, null, {skip: 0, limit: 400}).sort([['availableForSale', 'desc'], ['sort', 'asc']]);
      data.forEach(product => {
        const images = product.images.map(img => process.env.UPLOAD_PRODUCTS+img);

        products.push({
          id: product.id,
          title: product.title,
          image: product.images && product.images.length ? process.env.UPLOAD_PRODUCTS+product.images[0] : null,
          images,
          brand: product.brand,
          price: product.price,
          pricePerUnit: product.pricePerUnit,
          compareAtPrice: product.compareAtPrice,
          quantity: product.quantity,
          weight: product.weight,
          weightUnit: product.weightUnit,
          unit: product.unit,
          amountPerUnit: product.amountPerUnit,
          displayAmount: product.displayAmount,
          availableForSale: product.availableForSale
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