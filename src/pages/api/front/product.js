import { withSessionRoute } from '@/src/common/lib/withSession';
import dbConnect from '@/src/common/lib/dbConnect';
import Product from '@/src/common/models/Product';
import Collection from '@/src/common/models/Collection';
import Category from '@/src/common/models/Category';
import Discount from '@/src/common/models/Discount';
import User from '@/src/common/models/User';
import {getPrice} from '@/src/common/utils/currency';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    const userId = req.session.user ? req.session.user.id : null;

    const {productId} = req.query;

    const labels = [];
    const breadcrumbs = [];

    const product = await Product.findOne({_id: productId, status: 'active'});
    if (!product) {
      throw("not found product");
    }

    let compareAtPrice = 0;
    let price = product.price;

    const user = await User.findById(userId);
    const discountCode = user ? user.discount : 'new_user';

    const discount = await Discount.findOne(
      {
        status: 'active', code: discountCode, 
        startedAt: {$lt: new Date()}, finishedAt: {$gt: new Date()}
      }
    );
    if (discount) {
      const custom = discount.products.custom.find(c => c.productId.toString() === product.id);
      if (custom) {
        if (custom.isLabel) {
          labels.push(custom.title);
        }
        if (custom.percentage) {
          compareAtPrice = price;
          price -= getPrice(price*custom.percentage/100);
        }
      } else if (discount.products.all.enabled) {
        if (!discount.products.all.excludeProductIds.includes(product.id)) {
          compareAtPrice = price;
          price -= getPrice(price*discount.products.all.percentage/100);
        }
      }
    }

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
        price,
        compareAtPrice,
        pricePerUnit: product.pricePerUnit,
        currencyCode: product.currencyCode,
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
        labels
      }
    });
  } catch(e) {
    res.status(500).json({ error: 'failed to load data', breadcrumbs: [], product: {} });
  }
}