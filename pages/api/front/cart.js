import { withSessionRoute } from "../../../lib/withSession";
import dbConnect from '../../../lib/dbConnect';
import Cart from '../../../models/Cart';
import User from '../../../models/User';
import Product from '../../../models/Product';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    const {id: userId} = req.session.user;

    if (req.method === 'GET') {
      const cart = await handleGETAsync(userId, req.query);
      return res.status(200).json(cart);
    }

    if (req.method === 'POST') {
      const cart = await handleBodyPOSTAsync(userId, req.body);
      return res.status(200).json(cart);
    }

    if (req.method === 'PUT') {
      const cart = await handleBodyPUTAsync(userId, req.body);
      return res.status(200).json(cart);
    }

    if (req.method === 'DELETE') {
      const cart = await handleBodyDELETEAsync(userId, req.query);
      return res.status(200).json({deletedCarId: cart.id});
    }

    res.status(200).json(null);
  } catch(e) {
    res.status(200).json(null);
  }
}

async function handleGETAsync(userId, query) {
  try {
      const {userId: externalId} = query;

      const user = await User.findOne({'providers.firebase.externalId': externalId});
      if (!user) {
        throw('User not exist');
      }

      if (user.id !== userId) {
        throw('User not match');
      }

      const cart = await Cart.findOne({userId});
      if (!cart) {
        throw('Cart not exist');
      }

      const productIds = cart.products.map(p => p.productId);
      const products = await Product.find({'_id': {$in: productIds}});

      const productsCart = products.map(product => ({
        id: product.id,
        productId: product.id,
        title: product.title,
        image: product.images && product.images.length ? product.images[0] : null,
        images: product.images,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        brand: product.brand,
        quantity: cart.products.find(p => String(p.productId) === product.id).quantity,
      }));

      return {
        id: cart.id,
        userId: cart.userId,
        total: cart.total,
        products: productsCart || []
      };
  } catch(e) {
    console.log(e)
      throw e;
  }
}
async function handleBodyPOSTAsync(userId, body) {
  try {
      const {userId: externalId, total, products} = body;

      const user = await User.findOne({'providers.firebase.externalId': externalId});
      if (!user) {
        throw('User not exist');
      }

      if (user.id !== userId) {
        throw('User not match');
      }

      const newCart = await Cart.create({userId, total, products});

      return newCart;
  } catch(e) {
    console.log(e);
      throw e;
  }
}
async function handleBodyPUTAsync(userId, body) {
  try {
      let {cartId, total, products} = body;

      total = +total.toFixed(2);

      const cart = await Cart.findOneAndUpdate({cartId, userId}, {total, products, updatedAt: Date.now()});
      if (!cart) {
        throw('cart error');
      }

      return cart;
  } catch(e) {
    console.log(e)
      throw e;
  }
}
async function handleBodyDELETEAsync(userId, query) {
  try {
      const {cartId} = query;

      const cart = await Cart.findByIdAndRemove(cartId);
      if (!cart) {
        throw('cart error');
      }

      return cart;
  } catch(e) {
    console.log(e)
      throw e;
  }
}