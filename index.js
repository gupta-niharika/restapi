const Joi = require('joi');
const express = require('express');
const { func } = require('joi');
const app = express();

app.use(express.json()); //middleware

const courses = [
    { id: 1, name: "course 1" },
    { id: 2, name: "course 2" },
    { id: 3, name: "course 3" }
];

//GET requests
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

//GET with parameters
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('the course with the given id was not found');
    res.status(200).send(course);

});

//POST
app.post('/api/courses', (req, res) => {
    //Validation
    const { error } = validateCourse(req.body);     //results.error
    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.status(201).send(course);
});

//PUT
app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('the course with the given id was not found');

    //Validation
    const { error } = validateCourse(req.body);     //results.error
    if (error) return res.status(400).send(error.details[0].message);
    
    course.name = req.body.name;
    res.status(202).send(course);

});

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(6).required()
    });

    return schema.validate(course);

}

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('the course with the given id was not found');

    //delete
    const index = courses.indexOf(course);
    courses.splice(index,1);

    res.status(204).send(course);
});

//PORT
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}... `));