import { withSessionRoute } from '@/src/common/lib/withSession';
import dbConnect from '@/src/common/lib/dbConnect';
import Category from '@/src/common/models/Category';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    const data = await Category.find({enabled: true}, null, {skip: 0, limit: 30}).sort([['sort', 'asc']]);
    const categories = data.map(category => {
      const links = category.links.filter(l => l.enabled).map(link => {
        const links = link.links.filter(l => l.enabled);

        return {
          title: link.title,
          handle: link.handle,
          subjectId: link.subjectId,
          links
        };
      });

      return {
        id: category.id,
        title: category.title,
        image: category.image ? process.env.UPLOAD_CATEGORIES+category.image : null,
        links,
        hidden: category.hidden
      };
    });

    res.status(200).json(categories);
  } catch(e) {
    res.status(200).json(null);
  }
}