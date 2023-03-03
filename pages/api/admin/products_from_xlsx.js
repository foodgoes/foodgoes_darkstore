import xlsx from 'node-xlsx';
import mongoose from 'mongoose';

import { withSessionRoute } from "../../../lib/withSession";
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import Product from '../../../models/Product';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    const {id: userId} = req.session.user;
    if (!userId) {
      throw('Error, auth.');
    }

    const user = await User.findById(userId);
    if (!user.isAdmin) {
        throw('Error, permission.');
    }

    if (req.method === 'PUT') {
      const products = await handleBodyPUTAsync(userId, req.body);
      return res.status(200).json(products);
    }

    res.status(200).json(null);
  } catch(e) {
    res.status(200).json(null);
  }
}

async function handleBodyPUTAsync(userId) {
    try {
        const obj = xlsx.parse('./import_data/products.xlsx');
        const data = obj[0]['data'];
        const [keys, ...values] = data;

        const products = values.map(value => {
            return value.reduce((acc, v, i) => {
                acc[keys[i]] = v;
                return acc;
            }, {});
        });

        for (let product of products) {
            if (!product.update) {
                continue;
            }

            const productId = product._id || new mongoose.Types.ObjectId();
            await Product.findByIdAndUpdate(productId, {
                _id: productId,
                status: 'active',
                'title.en': product['title.en'],
                'title.he': product['title.he'],
                'title.ru': product['title.ru'],
                price: product.price, 
                compareAtPrice: product.compareAtPrice,
                quantity: product.quantity,
                sort: product.sort,
                'brand.en': product['brand.en'],
                'brand.he': product['brand.he'],
                'brand.ru': product['brand.ru'],
                'description.en': product['description.en'],
                'description.he': product['description.he'],
                'description.ru': product['description.ru']
            }, 
            {upsert: true, new: true});
        }

        return true;
    } catch(e) {
        console.log(e);
        throw e;
  }
}