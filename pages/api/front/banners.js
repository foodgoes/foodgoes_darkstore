import { withSessionRoute } from "@/lib/withSession";
import dbConnect from '@/lib/dbConnect';
import Banner from '@/models/Banner';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();

    const data = await Banner.find({enabled: true}, null, {skip: 0, limit: 10}).sort([['sort', 'asc']]);
    const banners = data.map(banner => {
      return {
        id: banner.id,
        title: banner.title,
        image: banner.image ? process.env.UPLOAD_BANNERS+banner.image : null,
        url: banner.url
      };
    });

    res.status(200).json(banners);
  } catch(e) {
    console.log(e);
    res.status(200).json(null);
  }
}