import { withSessionRoute } from "../../../lib/withSession";
import dbConnect from '../../../lib/dbConnect';
import Category from '../../../models/Category';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    const categories = [];

    const data = await Category.find({enabled: true}, null, {skip: 0, limit: 30}).sort([['sort', 'asc']]);
    data.forEach(c => {
      categories.push(c);
    });

    res.status(200).json(categories);
  } catch(e) {
    console.log(e);
    res.status(200).json(null);
  }
}