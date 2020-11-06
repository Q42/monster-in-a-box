const functions = require('firebase-functions');
const cors = require('cors')({ origin: true }); 
const admin = require('firebase-admin');
admin.initializeApp();

exports.addMessage = cors(req, res, async () => { 
  functions.https.onRequest(async (req, res) => {
    const body = req.body;
    if (typeof body !== "object") {
      return res.status(400).json({ message: "body is not an object, content-type:application/json missing?" });
    }

    const user = body.user;
    if (!user) {
      return res.status(400).json({ message: "missing property 'user' containing userid (=monsterid)" });
    }

    const doc = Object.assign({}, body, { timestamp: (+new Date()) });
    
    delete doc.user;

    if (doc.type !== 'userJoined') {
      console.log(`pushing to /monsters/${user}/events: ${JSON.stringify(doc)}`);
      const writeResult = await admin.firestore().collection("monsters").doc(user).collection('events').add(doc);
      res.json({ id: `/monsters/${user}/events/${writeResult.id}`, doc });
    } else {
      console.log(`pushing to all monster event queues: ${JSON.stringify(doc)}`);
      const writeResult = await admin.firestore().collection("monsters").doc('Arian').collection('events').add(doc);
      const writeResult2 = await admin.firestore().collection("monsters").doc('Korjan').collection('events').add(doc);
      res.json({ message: 'written to all queues', doc });
    }
  });
});