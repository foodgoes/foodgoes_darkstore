import { withSessionRoute } from "../../../lib/withSession";
import dbConnect from '../../../lib/dbConnect';
import Product from '../../../models/Product';
import Collection from '../../../models/Collection';
import Category from "../../../models/Category";

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
        
          const {title, productIds} = collection;
          const productsData = await Product.find({status: 'active', '_id': {$in: productIds}}, null, {skip: 0, limit: 50}).sort([['sort', 'asc']]);

          const products = productsData.map(product => ({
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