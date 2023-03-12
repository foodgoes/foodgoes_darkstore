import { withSessionRoute } from "@/lib/withSession";
import dbConnect from '@/lib/dbConnect';
import Discount from '@/models/Discount';
import Order from "@/models/Order";

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();
    
    const userId = req.session.user ? req.session.user.id : null;

    const data = await Discount.find(
      {status: 'active', startedAt: {$lt: new Date()}, finishedAt: {$gt: new Date()}}, null, 
      {skip: 0, limit: 30}).sort([['startedAt', 'desc']]);

    const discounts = {products: [], shipping: []};

    for (let doc of data) {
      let isValidDiscount = true;
      const {conditions} = doc;

      for (let condition of conditions) {
        if (condition.orderCountEqual !== undefined && condition.orderCountEqual !== null) {
          if (userId) {
            const orderCount = await Order.countDocuments({userId});
            if (orderCount !== condition.orderCountEqual) {
              isValidDiscount = false;
            }
          }
        }
      }

      if (!isValidDiscount) {
        continue;
      }

      const discount = {
        id: doc.id,
        title: doc.title,
        previewDescription: doc.previewDescription,
        description: doc.description,
        ruleSet: doc.ruleSet
      };

      discounts[doc.subjectType].push(discount);
    }

    res.status(200).json(discounts);
  } catch(e) {
    console.log(e);
    res.status(200).json(null);
  }
}