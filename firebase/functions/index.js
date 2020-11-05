const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

exports.addMessage = functions.https.onRequest(async (req, res) => {
  const body = req.body;
  if (typeof body !== "object") {
    return res.status(400).json({ message: "body is not an object, content-type:application/json missing?" });
  }

  const user = body.user;
  const doc = { body, timestamp: (+new Date()) };

  if (!user) {
    return res.status(400).json({ message: "missing property 'user' containing userid (=monsterid)" });
  }

  console.log(`pushing to /monsters/${user}/events: ${JSON.stringify(doc)}`);
  const writeResult = await admin.firestore().collection("monsters").doc(user).collection('events').add(doc);
  res.json({ id: `/monsters/${user}/events/${writeResult.id}`, doc });
});