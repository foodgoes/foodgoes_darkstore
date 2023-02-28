import { withSessionRoute } from "../../../lib/withSession";
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';

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

    res.status(200).json({ ok: true });
  } catch(e) {
    res.status(500).json({ error: 'failed to signup' });
  }
}

async function handleFormInputAsync(body) {
    try {
        const providers = ['firebase'];
        const {id: externalId, phoneNumber: phone, provider} = body;

        if (!providers.includes(provider)) {
            throw('error provider');
        }

        const newUser = await User.create({phone, providers: {[provider]: {externalId}}});

        return newUser;
    } catch(e) {
        throw e;
    }
}