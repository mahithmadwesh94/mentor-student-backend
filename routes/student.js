const router = require('express').Router();
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const dburi = process.env.ATLAS_URI;

router.route('/').get(async (req, res) => {
    let client = await mongoClient.connect(dburi);
    try {
        let db = client.db('mentor-student');
        const data = await db.collection('students').find().toArray();
        res.json(data);

    } catch (err) {
        res.status(400).json('Error: ' + err);
    } finally {
        client.close();
    }

});

router.route('/add').post(async (req, res) => {
    let client = await mongoClient.connect(dburi);
    try {
        let db = client.db('mentor-student');
        const data = await db.collection('students').insertMany(req.body);
        res.json({ message: "Student Created" })

    } catch (err) {
        res.status(400).json('Error: ' + err)
    } finally {
        client.close();
    }

})
module.exports = router;