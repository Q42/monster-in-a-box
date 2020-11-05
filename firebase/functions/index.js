const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.addMessage = functions.https.onRequest(async (req, res) => {
  const text = req.query.text;
  const doc = { text, date: (+new Date()) };
  const writeResult = await admin.firestore().collection('messages').add(doc);
  res.json({ id: `/messages/${writeResult.id}`, doc });
});