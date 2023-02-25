import db from "../../utils/firestore-server";

export default async function handler(req, res) {
  try {
    const {slug, slug2} = req.query;
    const products = [];
    let currentLinks = null;

    if (slug && slug2) {
      const getLinkBySlug = (slug, links) => {
        let res = null;

        if (links) {
          links.forEach(l => {
            if (slug === l.slug) res = l;
          });
        }

        return res;
      };

      const snapshot = await db.collection('categories').where('enabled', '==', true).get();
      snapshot.forEach((doc) => {
        const {links} = doc.data();
        if (links) {
          const l = getLinkBySlug(slug, links);
          if (l) {
            const l2 = getLinkBySlug(slug2, l.links);
            currentLinks = {
              baseLink: {
                id: doc.id,
                title: doc.data().title
              },
              link: l,
              nestedLink: l2
            };
          }
        }
      });

      if (currentLinks.nestedLink) {
        if (currentLinks.nestedLink.collectionId) {
          const collectionDoc = await db.collection('collections').doc(currentLinks.nestedLink.collectionId).get();
          const {title, productIds} = collectionDoc.data();

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
        }
      }
    } else {
      const snapshot = await db.collection('products').where('enabled', '==', true).orderBy('sort', 'asc').limit(25).get();
      snapshot.forEach((doc) => {
        const {images} = doc.data();
  
        products.push({
          id: doc.id,
          ...doc.data(),
          image: images.length > 0 ? images[0] : null
        })
      });
    }
  
    res.status(200).json({
      products,
      currentLinks
    });
  } catch(e) {
    console.log(e);
    res.status(200).json(null);
  }
}