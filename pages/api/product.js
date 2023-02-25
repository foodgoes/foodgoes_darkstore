import db from "../../utils/firestore-server";

export default async function handler(req, res) {
  try {    
    const {productId} = req.query;
    
    const productRef = db.collection('products').doc(productId);
    const doc = await productRef.get();
    if (!doc.exists) {
      return res.status(200).json(null);
    }

    const {images, enabled} = doc.data();
    
    if (!enabled) {
      return res.status(200).json(null);
    }

    const product = {
      id: doc.id,
      ...doc.data(),
      image: images.length > 0 ? images[0] : null
    };

    res.status(200).json(product);
  } catch(e) {
    res.status(200).json(null);
  }
}