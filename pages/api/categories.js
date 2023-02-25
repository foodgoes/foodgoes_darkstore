import db from "../../utils/firestore-server";

export default async function handler(req, res) {
  try {    
    const categories = []; 
    
    const snapshot = await db.collection('categories').where('enabled', '==', true).orderBy('sort', 'asc').limit(25).get();
    snapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data()
      })
    });
  
    res.status(200).json(categories);
  } catch(e) {
    res.status(200).json(null);
  }
}