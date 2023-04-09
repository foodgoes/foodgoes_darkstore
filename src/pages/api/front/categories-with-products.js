import { withSessionRoute } from '@/src/common/lib/withSession';
import dbConnect from '@/src/common/lib/dbConnect';
import Product from '@/src/common/models/Product';
import Collection from '@/src/common/models/Collection';
import Category from '@/src/common/models/Category';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    const {slug} = req.query;

    let baseLink = null;
    const dataCategories = await Category.find({enabled: true}, null, {skip: 0, limit: 45});
    dataCategories.forEach(doc => {
      doc.links.forEach(l => {
        if (slug === l.handle) {
          baseLink = {
            category: doc,
            links: l.links
          };
        }
      }); 
    });

    const linksWithProducts = [];

    if (baseLink.links) {
      for (let link of baseLink.links) {
        if (link.subjectId) {
          const collection = await Collection.findById(link.subjectId);

          if (!collection) {
            continue;
          }

          const {title, productIds} = collection;
          const productsData = await Product.find({status: 'active', '_id': {$in: productIds}}, null, {skip: 0, limit: 50}).sort([['availableForSale', 'desc'], ['sort', 'asc']]);

          const products = productsData.map(product => {
            const images = product.images.map(img => ({
              src: img.src,
              srcWebp: img.srcWebp,
              width: img.width,
              height: img.height,
              alt: img.alt
            }));
            
            return {
              id: product.id,
              title: product.title,
              image: images.length ? images[0] : null,
              images,
              price: product.price,
              compareAtPrice: product.compareAtPrice,
              brand: product.brand,
              quantity: product.quantity,
              weight: product.weight,
              weightUnit: product.weightUnit,
              unit: product.unit,
              amountPerUnit: product.amountPerUnit,
              displayAmount: product.displayAmount,
              availableForSale: product.availableForSale
            };
          });

          linksWithProducts.push({
            title: link.title,
            slug: link.slug,
            products
          });
        }
      }
    } else {
      linksWithProducts.push({
        title: link.title,
        slug: link.slug
      });
    }


    res.status(200).json(linksWithProducts);
  } catch(e) {
    console.log(e)
    res.status(200).json(null);
  }
}