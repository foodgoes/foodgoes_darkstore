import { v4 as uuidv4 } from 'uuid';
import { withSessionRoute } from '@/src/common/lib/withSession';
import dbConnect from '@/src/common/lib/dbConnect';
import Cart from '@/src/common/models/Cart';
import Product from '@/src/common/models/Product';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    const id = req.session.user ? req.session.user.id : null;
    const {cart: token} = req.cookies;

    if (req.method === 'GET') {
      const cart = await handleGETAsync(id, token, req.query);
      return res.status(200).json(cart);
    }

    if (req.method === 'PUT') {
      const cart = await handleBodyPUTAsync(id, token, req.body, req.headers);
      if (!cart.userId && !token) {
        const d = new Date();
        d.setTime(d.getTime() + (7*24*60*60*1000));
        const expires = "expires="+ d.toUTCString();
        res.setHeader('Set-Cookie', `cart=${cart.token}; ${expires}; path=/`);
      }
      return res.status(200).json(cart);
    }

    if (req.method === 'DELETE') {
      const cart = await handleBodyDELETEAsync(req.query);
      if (!cart.userId) {
        res.setHeader('Set-Cookie', 'cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;');
      }

      return res.status(200).json({deletedCartId: cart.id});
    }

    res.status(200).json(null);
  } catch(e) {
    res.status(200).json(null);
  }
}

async function handleGETAsync(userId, token) {
  try {
    if (!userId && !token) {
      throw('cart error');
    }

    const filter = userId ? {userId} : {token};
    const cart = await Cart.findOne(filter);
    if (!cart) {
      throw('Cart not exist');
    }

    const productIds = cart.products.map(p => p.productId);
    const products = await Product.find({'_id': {$in: productIds}});

    const productsCart = products.map(product => ({
      id: product.id,
      productId: product.id,
      title: product.title,
      image: product.images && product.images.length ? process.env.UPLOAD_PRODUCTS+product.images[0] : null,
      images: product.images.map(img => process.env.UPLOAD_PRODUCTS+img),
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      brand: product.brand,
      quantity: cart.products.find(p => String(p.productId) === product.id).quantity,
      excludeDiscount: product.excludeDiscount,
      ageRestricted: product.ageRestricted
    }));

    return {
      id: cart.id,
      userId: cart.userId,
      total: cart.total,
      products: cart.products,
      productsV2: productsCart || []
    };
  } catch(e) {
      throw e;
  }
}
async function handleBodyPUTAsync(userId, token, body, headers) {
  try {
      // check location !!!!

      let {total, products} = body;

      total = +total.toFixed(2);

      const newToken = token || uuidv4();

      const filter = userId ? {userId} : {token};
      const update = {token: userId ? uuidv4() : newToken, total, products, updatedAt: Date.now()};
      const cart = await Cart.findOneAndUpdate(filter, update, {upsert: true, new: true});
      if (!cart) {
        throw('cart error');
      }

      return cart;
  } catch(e) {
    console.log(e)
    throw e;
  }
}
async function handleBodyDELETEAsync(query) {
  try {
    const {id} = query;
    const cart = await Cart.findOneAndRemove({_id: id});
    if (!cart) {
      throw('cart error');
    }

    return cart;
  } catch(e) {
      throw e;
  }
}