import { withSessionRoute } from '@/src/common/lib/withSession';
import dbConnect from '@/src/common/lib/dbConnect';
import User from '@/src/common/models/User';
import Location from '@/src/common/models/Location';
import Cart from '@/src/common/models/Cart';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    const user = await handleFormInputAsync(req);

    req.session.user = {
        id: user._id,
        email: user.email
    };
    await req.session.save();

    res.status(200).json({ ok: true });
  } catch(e) {
    res.status(500).json({ error: 'failed to signup' });
  }
}

async function handleFormInputAsync(req) {
    try {
      const tokenLocation = req.cookies.location;
      const tokenCart = req.cookies.cart;

      const {id: externalId, phoneNumber: phone, provider, locale} = req.body;
      const providers = ['firebase'];

      if (!providers.includes(provider)) {
        throw('error provider');
      }

      const discount = 'new_user';
      const newUser = await User.create({phone, providers: {[provider]: {externalId}}, locale, discount});

      if (tokenLocation) {
        await Location.findOneAndUpdate({token: tokenLocation}, {userId: newUser.id}); 
      }
      if (tokenCart) {
        await Cart.findOneAndUpdate({token: tokenCart}, {userId: newUser.id});
      }

      return newUser;
    } catch(e) {
      throw e;
    }
}