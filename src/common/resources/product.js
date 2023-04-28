import dbConnect from '@/src/common/lib/dbConnect';
import Product from '@/src/common/models/Product';
import Discount from '@/src/common/models/Discount';
import {financial} from '@/src/common/utils/utils';

export default async function ResourceProduct({filter, projection=null, options, sort}, payload) {
    try {
        await dbConnect();

        const {discountCode = 'new_user'} = payload;

        const result = [];

        const products = await Product.find(filter, projection, options).sort(sort);
        const discount = await Discount.findOne(
          {
            status: 'active', code: discountCode, 
            startedAt: {$lt: new Date()}, finishedAt: {$gt: new Date()}
          }
        );

        for (let product of products) {
          const labels = [];

          let compareAtPrice = 0;
          let price = product.price;
          
          if (discount) {
            const custom = discount.products.custom.find(c => c.productId.toString() === product.id);
            if (custom) {
              if (custom.isLabel) {
                labels.push(custom.title);
              }
              if (custom.percentage) {
                compareAtPrice = price;
                price -= financial(price*custom.percentage/100);
              }
            } else if (discount.products.all.enabled) {
              if (!discount.products.all.excludeProductIds.includes(product.id)) {
                compareAtPrice = price;
                price -= financial(price*discount.products.all.percentage/100);
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
    
          result.push({
            id: product.id,
            title: product.title,
            image: images.length ? images[0] : null,
            images,
            brand: product.brand,
            price,
            pricePerUnit: product.pricePerUnit,
            compareAtPrice,
            quantity: product.quantity,
            unit: product.unit,
            amountPerUnit: product.amountPerUnit,
            displayAmount: product.displayAmount,
            availableForSale: product.availableForSale,
            labels
          });
        }

        return result;
    } catch(e) {
      return [];
    }
}