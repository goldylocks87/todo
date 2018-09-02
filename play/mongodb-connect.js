const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', 
    (err, db) => {

        if(err) return console.log('Couldn\'t connect to db...');
        else console.log('Connected to database...');

        db.collection('Todos').find().toArray()
        .then( (docs) => {

        }, (err) => {
            console.log('Connected to database...');

        });

        db.close(); // closes connection to server
    });