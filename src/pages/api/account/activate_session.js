import { withSessionRoute } from '@/src/common/lib/withSession';
import dbConnect from '@/src/common/lib/dbConnect';
import User from '@/src/common/models/User';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    const user = await handleFormInputAsync(req.body);

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

async function handleFormInputAsync(body) {
    try {
        const {phoneNumber: phone} = body;

        const newUser = await User.findOne({phone});

        return newUser;
    } catch(e) {
        throw e;
    }
}