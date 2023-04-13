import { withSessionRoute } from '@/src/common/lib/withSession';
import dbConnect from '@/src/common/lib/dbConnect';
import Product from '@/src/common/models/Product';
import Collection from '@/src/common/models/Collection';
import Category from '@/src/common/models/Category';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    const {productId} = req.query;

    const product = await Product.findOne({_id: productId, status: 'active'});
    if (!product) {
      throw("not found product");
    }

    const breadcrumbs = [];
    const collection = await Collection.findOne({productIds: product.id});
    if (collection) {
      const category = await Category.findOne({'links.links.subjectId': collection._id, enabled: true});
      if (category) {
        for (let i=0; i < category.links.length; i++) {
          const linkF = category.links[i];
          const linkS = linkF.links.find(l => String(l.subjectId) === collection.id);
          if (linkS) {  
            breadcrumbs.push({
              id: linkF.id,
              title: linkF.title,
              handle: '/category/' + linkF.handle,
            });
            breadcrumbs.push({
              id: linkS.id,
              title: linkS.title,
              handle: '/category/' + linkF.handle + '/' + linkS.handle,
            });
  
            break;
          }
        }
      }
    }

    const images = product.images.map(img => ({
      src: img.src,
      srcWebp: img.srcWebp,
      width: img.width,
      height: img.height,
      alt: img.alt
    }));

    res.status(200).json({
      breadcrumbs,
      product: {
        id: product.id,
        title: product.title,
        subTitle: product.subTitle,
        image: images.length ? images[0] : null,
        images,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        pricePerUnit: product.pricePerUnit,
        currencyCode: product.currencyCode,
        weight: product.weight,
        weightUnit: product.weightUnit,
        unit: product.unit,
        amountPerUnit: product.amountPerUnit,
        displayAmount: product.displayAmount,
        country: product.country,
        disclaimer: product.disclaimer,
        ingredients: product.ingredients,
        manufacturer: product.manufacturer,
        brand: product.brand,
        shelfLife: product.shelfLife,
        currencyCode: product.currencyCode,
        availableForSale: product.availableForSale,
      }
    });
  } catch(e) {
    res.status(500).json({ error: 'failed to load data', breadcrumbs: [], product: {} });
  }
}