const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');

const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();

app.use( bodyParser.json() );

app.post('/todos', (req, res) => {

    console.log(req.body);

    var newTodo = new Todo({
        text: req.body.text,
    });

    newTodo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err); 
    }).catch(err => console.error(err));
});

app.get('/todos', (req, res) => {

    Todo.find({}).then((todos) => {
        res.send({todos});
    },(err) => {
        res.status(400).send(err); 
    }).catch(err => console.error(err));
});

module.exports = { app };

app.listen(3000, () => {
    console.log('app started on port 3000...');
});