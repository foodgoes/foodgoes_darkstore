import dbConnect from './dbConnect';
import Counter from '@/src/models/Counter';

export async function getNextSequence(name) {
    try {
        await dbConnect();

        const ret = await Counter.findOneAndUpdate(
            { _id: name },
            { $inc: { seq: 1 } },
            { new: true, upsert: true}
        );
     
        return ret.seq;
    } catch(e) {
        return null;   
    }
 }