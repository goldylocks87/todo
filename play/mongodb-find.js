const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', 
    (err, db) => {

        if(err) return console.log('Couldn\'t connect to db...');
        else console.log('Connected to database...');

        // db.collection('Todos').find(
        //     {
        //         completed: false
        //     }).toArray()
        // .then( (docs) => {
        //     console.log(JSON.stringify(docs, undefined, 2));
        // }, (err) => {
        //     console.log('Error connecting to database...');
        //     console.error(err);

        // });
        db.collection('Todos').find().count()
        .then( (count) => {
            console.log(`to do count : ${count}`);
        }, (err) => {
            console.log('Error connecting to database...');
            console.error(err);

        });

        db.close(); // closes connection to server
    });