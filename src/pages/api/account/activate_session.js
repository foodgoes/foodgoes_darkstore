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

    res.status(200).json(user);
  } catch(e) {
    res.status(500).json(null);
  }
}

async function handleFormInputAsync(req) {
    try {
      const tokenLocation = req.cookies.location;
      const tokenCart = req.cookies.cart;

      const {phoneNumber: phone} = req.body;

      const user = await User.findOne({phone});

      if (tokenLocation) {
        await Location.findOneAndUpdate({token: tokenLocation, userId: null}, {userId: user.id}); 
      }
      if (tokenCart) {
        await Cart.findOneAndUpdate({token: tokenCart, userId: null}, {userId: user.id});
      }

      return user;
    } catch(e) {
      throw e;
    }
}