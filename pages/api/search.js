import db from "../../utils/firestore-server";

export default async function handler(req, res) {
  try {
    let {q, locale} = req.query;

    if (q === null || q === undefined) {
      throw 'invalid query';
    }

    q = q.trim();
    if (q === '') {
      throw 'Empty query';
    }

    const qLength = q.length;
    if (qLength < 3) {
      throw 'Minimum 3 symbols';
    }
    if (qLength > 50) {
      throw 'Maximum 10 symbols';
    }

    q = q.toLowerCase();

    const products = [];
    const snapshot = await db.collection('products')
    .where('search.'+locale, 'array-contains', q)
    .where('enabled', '==', true)
    .limit(10)
    .get();
    if (!snapshot.empty) {
      snapshot.docs.forEach(doc => {
        products.push({
          id: doc.id,
          ...doc.data(),
          image: doc.data().images.length > 0 ? doc.data().images[0] : null,
        });
      });
    }
  
    res.status(200).json({
      products,
      phrase: q,
      count: snapshot.size
    });
  } catch(e) {
    res.status(200).json(null);
  }
}