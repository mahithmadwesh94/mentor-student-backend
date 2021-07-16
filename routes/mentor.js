const router = require('express').Router();
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const dburi = process.env.ATLAS_URI;

router.route('/').get(async (req, res) => {
    let client = await mongoClient.connect(dburi);
    try {
        let db = client.db('mentor-student');
        const data = await db.collection('mentors').find().toArray();
        res.json(data)

    } catch (err) {
        res.status(400).json('Error: ' + err);
    }

});

router.route('/students/:id').get(async (req, res) => {
    let client = await mongoClient.connect(dburi);
    const objid = mongodb.ObjectId(req.params.id)
    try {
        let db = client.db('mentor-student');
        const data = await db.collection('mentors').findOne({ _id: objid });
        res.json(data.students)

    } catch (err) {
        res.status(400).json('Error: ' + err);
    }

});

router.route('/student-mentor/:name').get(async (req, res) => {
    let client = await mongoClient.connect(dburi);

    try {
        let db = client.db('mentor-student');
        const data = await db.collection('mentors').find({ students: `${req.params.name}` }).toArray();
        res.json(data)

    } catch (err) {
        res.status(400).json('Error: ' + err);
    }

});




router.route('/add').post(async (req, res) => {
    let client = await mongoClient.connect(dburi);
    try {
        let db = client.db('mentor-student');
        const data = await db.collection('mentors').insertMany(req.body);
        res.json({ message: "Mentors Created" })

    } catch (err) {
        res.status(400).json('Error: ' + err)
    } finally {
        client.close();
    }
})

//remove a student from a mentor using mentor id
router.route('/remove-student/:id').post(async (req, res) => {
    let client = await mongoClient.connect(dburi);
    const objid = mongodb.ObjectId(req.params.id)
    try {
        let db = client.db('mentor-student');
        const data = await db.collection('mentors').updateOne({ _id: objid }, { $pull: { 'students': req.body.studentName } });
        if (data) {
            const data = await db.collection('mentors').updateOne({ _id: mongodb.ObjectId(req.body.newMentorId) }, { $push: { students: req.body.studentName } });
            res.json({ message: "Mentors Updated" })
        }


    } catch (err) {
        res.status(400).json('Error: ' + err)
    } finally {
        client.close();
    }
})




router.route('/assign-students/:id').put(async (req, res) => {
    let client = await mongoClient.connect(dburi);
    const objid = mongodb.ObjectId(req.params.id)
    try {
        let db = client.db('mentor-student');
        const data = await db.collection('mentors').updateOne({ _id: objid }, { $set: { students: req.body.students } })
        // const data = await db.collection('mentors').updateOne({ _id: req.params.id }, { $set: { "students": req.body } })
        if (data) {
            res.json({ message: 'Success' })
        }


    } catch (err) {
        res.status(400).json('Error: ' + err)
    } finally {
        client.close();
    }
})

module.exports = router;