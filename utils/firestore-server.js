const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
    projectId: process.env.PROJECT_ID,
    keyFilename: './'+process.env.KEY_FILENAME,
});

export default db;