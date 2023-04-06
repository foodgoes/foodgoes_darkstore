import { withSessionRoute } from '@/src/lib/withSession';

export default withSessionRoute(handler);

async function handler(req, res) {
  req.session.destroy();
  res.send({ ok: true });
}
