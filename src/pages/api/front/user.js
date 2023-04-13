import { withSessionRoute } from '@/src/common/lib/withSession';
import dbConnect from '@/src/common/lib/dbConnect';
import User from '@/src/common/models/User';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    const {id} = req.session.user;
    if (!id) {
      throw('Error, auth.');
    }
    
    if (req.method === 'GET') {
      const user = await handleGETAsync(id);
      return res.status(200).json({
        id: user.id,
        isAdmin: user.isAdmin,
        locale: user.locale
      });
    }

    if (req.method === 'PUT') {
      const user = await handleBodyPUTAsync(id, req.body);
      return res.status(200).json({
        id: user.id,
        isAdmin: user.isAdmin,
        locale: user.locale
      });
    }

    res.status(200).json(null);
  } catch(e) {
    res.status(200).json(null);
  }
}

async function handleGETAsync(id) {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw("not found user")
    }

    return user;
  } catch(e) {
      throw e;
  }
}

async function handleBodyPUTAsync(id, body) {
  try {
    const update = {updatedAt: Date.now()};
    if (body.locale) {
      update.locale = body.locale;
    }

    const user = await User.findByIdAndUpdate(id, update, {new: true});
    if (!user) {
      throw('user error');
    }

    return user;
  } catch(e) {
    throw e;
  }
}