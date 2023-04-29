import { withSessionRoute } from '@/src/common/lib/withSession';
import dbConnect from '@/src/common/lib/dbConnect';
import User from '@/src/common/models/User';
import Discount from '@/src/common/models/Discount';
import Alert from '@/src/common/models/Alert';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    const userId = req.session.user ? req.session.user.id : null;

    const user = await User.findById(userId);
    const discountCode = user ? user.discount : 'new_user';

    const alerts = await Alert.find({enabled: true, startedAt: {$lt: new Date()}, 
      $or: [{finishedAt: null}, {finishedAt: {$gt: new Date()}}]}, null, {skip: 0, limit: 4});

    const result = [];
    for (let alert of alerts) {
      if (alert.subjectType === 'discount') {
        const discount = await Discount.findById(alert.subjectId);
        if (discount.code !== discountCode) {
          continue;
        }
      }

      result.push({
        id: alert.id,
        previewImage: alert.previewImage ? process.env.UPLOAD_URL+'/alerts/'+alert.previewImage : null,
        previewDescription: alert.previewDescription,
        image: alert.image ? process.env.UPLOAD_URL+'/alerts/'+alert.image : null,
        title: alert.title,
        descriptionHtml: alert.descriptionHtml,
        caption: alert.caption,
        action: alert.action,
      });
    }

    res.status(200).json(result);
  } catch(e) {
    res.status(200).json([]);
  }
}