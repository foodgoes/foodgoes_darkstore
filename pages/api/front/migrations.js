import { withSessionRoute } from "@/lib/withSession";
import dbConnect from '@/lib/dbConnect';
import Search from '@/models/Search';

import mongoose from 'mongoose';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect(); 

    const ids = [];

    const data = await Search.find({}, null, {skip: 0, limit: 2});
    for (let doc of data) {
      ids.push(doc._id);

      await Search.create({
        _id: new mongoose.Types.ObjectId(),
        keywords: doc.keywords,
        productIds: doc.productIds,
        enabled: doc.enabled
      });
    }

    await Search.deleteMany({_id: {$in: ids}})

    res.status(200).json({status: 'success'});
  } catch(e) {
    console.log(e)
    res.status(200).json({status: 'error'});
  }
}