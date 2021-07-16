const express = require('express');
const cors = require('cors');





require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const mentorRouter = require('./routes/mentor');
const studentRouter = require('./routes/student');

app.use('/students', studentRouter);
app.use('/mentors', mentorRouter);



app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
})

