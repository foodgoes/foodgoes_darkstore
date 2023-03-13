import { v4 as uuidv4 } from 'uuid';
import { withSessionRoute } from "../../../lib/withSession";
import dbConnect from '../../../lib/dbConnect';
import Location from '../../../models/Location';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    const id = req.session.user ? req.session.user.id : null;
    const {location: token} = req.cookies;

    if (req.method === 'GET') {
      const location = await handleGETAsync(id, token, req.query);
      return res.status(200).json(location);
    }

    if (req.method === 'PUT') {
      const location = await handleBodyPUTAsync(id, token, req.body);
      if (!location.userId && !token) {
        const d = new Date();
        d.setTime(d.getTime() + (180*24*60*60*1000));
        const expires = "expires="+ d.toUTCString();
        res.setHeader('Set-Cookie', `location=${location.token}; ${expires}; path=/`);
      }
      return res.status(200).json(location);
    }

    if (req.method === 'DELETE') {
      const location = await handleBodyDELETEAsync(req.query);
      if (!location.userId) {
        res.setHeader('Set-Cookie', 'location=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;');
      }

      return res.status(200).json({deletedLocationId: location.id});
    }

    res.status(200).json(null);
  } catch(e) {
    console.log(e)
    res.status(200).json(null);
  }
}

async function handleGETAsync(userId, token) {
  try {
    if (!userId && !token) {
      throw('location error');
    }

    const filter = userId ? {userId} : {token};
    const location = await Location.findOne(filter);
    if (!location) {
      throw('Location not exist');
    }

    return {
      id: location.id,
      userId: location.userId,
      address: location.address,
    };
  } catch(e) {
      throw e;
  }
}
async function handleBodyPUTAsync(userId, token, body) {
  try {
      let {address: address1 = ''} = body;

      address1 = address1.trim();
      if (!address1) {
        throw('Error, empty address');
      }

      const newToken = token || uuidv4();

      const filter = userId ? {userId} : {token};
      const address = {address1};
      const update = {name: 'manual address', token: userId ? uuidv4() : newToken, address, default: true, updatedAt: Date.now()};
      const location = await Location.findOneAndUpdate(filter, update, {upsert: true, new: true});
      if (!location) {
        throw('location error');
      }
     return location;
  } catch(e) {
    console.log(e)
    throw e;
  }
}
async function handleBodyDELETEAsync(query) {
  try {
    const {id} = query;
    const location = await Location.findOneAndRemove({_id: id});
    if (!location) {
      throw('location error');
    }

    return location;
  } catch(e) {
      throw e;
  }
}