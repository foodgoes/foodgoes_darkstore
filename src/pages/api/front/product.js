import { withSessionRoute } from '@/src/common/lib/withSession';
import dbConnect from '@/src/common/lib/dbConnect';
import Product from '@/src/common/models/Product';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    const {productId} = req.query;

    const product = await Product.findOne({_id: productId, status: 'active'});
    if (!product) {
      throw("not found product")
    }

    const images = product.images.map(img => ({
      src: img.src,
      srcWebp: img.srcWebp,
      width: img.width,
      height: img.height,
      alt: img.alt
    }));

    res.status(200).json({
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
    });
  } catch(e) {
    res.status(200).json(null);
  }
}