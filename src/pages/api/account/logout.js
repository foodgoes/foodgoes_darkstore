import { withSessionRoute } from '@/src/common/lib/withSession';
import dbConnect from '@/src/common/lib/dbConnect';
import Cart from '@/src/common/models/Cart';

export default withSessionRoute(handler);

async function handler(req, res) {
  try {
    await dbConnect();
    const tokenCart = req.cookies.cart;  
    if (tokenCart) {
      await Cart.findOneAndRemove({token: tokenCart});
      res.setHeader('Set-Cookie', 'cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;');
    }
  
    req.session.destroy();
    res.send({ ok: true });
  } catch(e) {
    res.send({ ok: false });
  }
}
