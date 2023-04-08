import { withSessionRoute } from '@/src/common/lib/withSession';
import dbConnect from '@/src/common/lib/dbConnect';
import User from '@/src/common/models/User';
import Location from '@/src/common/models/Location';
import Cart from '@/src/common/models/Cart';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    const user = await handleFormInputAsync(req.body, req.cookies);

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

async function handleFormInputAsync(body, cookies) {
    try {
      const {cart: tokenCart, location: tokenLocation} = cookies;
      
      const providers = ['firebase'];
      const {id: externalId, phoneNumber: phone, provider} = body;

      if (!providers.includes(provider)) {
        throw('error provider');
      }

      const newUser = await User.create({phone, providers: {[provider]: {externalId}}});

      await Location.findOneAndUpdate({token: tokenLocation}, {userId: newUser.id}, {new: true, upsert: true});
      await Cart.findOneAndUpdate({token: tokenCart}, {userId: newUser.id}, {new: true, upsert: true});

      return newUser;
    } catch(e) {
      throw e;
    }
}