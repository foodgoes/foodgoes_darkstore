import db from "../../utils/firestore-server";

export default async function handler(req, res) {
  try {
    const {slug} = req.query;

    let baseLink = null;
    const snapshot = await db.collection('categories').where('enabled', '==', true).get();
    snapshot.forEach((doc) => {
      const {links} = doc.data();
      if (links) {
        links.map(l => {
          if (slug === l.slug) {
            baseLink = {
              category: {
                id: doc.id,
                title: doc.data().title
              },
              ...l
            };
          }
        }); 
      }
    });

    const linksWithProducts = [];
    if (baseLink.links) {
      for (let link of baseLink.links) {
        if (link.collectionId) {
          const collectionDoc = await db.collection('collections').doc(link.collectionId).get();
          const {title, productIds} = collectionDoc.data();

          const products = [];
          const snapshot = await db.collection('products')
          .where('__name__', 'in', productIds)
          .where('enabled', '==', true)
          .limit(25).get();
          snapshot.forEach(doc => {
            products.push({
              id: doc.id,
              ...doc.data(),
              image: doc.data().images.length > 0 ? doc.data().images[0] : null
            })
          });

          linksWithProducts.push({
            title: link.title,
            slug: link.slug,
            products
          });
        }
      }
    } else {
      linksWithProducts.push({
        title: link.title,
        slug: link.slug
      });
    }

    res.status(200).json(linksWithProducts);
  } catch(e) {
    res.status(200).json(null);
  }
}