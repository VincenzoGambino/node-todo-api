const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to Mongo db server');
    }
    console.log('Connected to MondoDB server');

    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: "something to do 2",
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert todo, err');
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    db.collection('User').insertOne({
        name: 'Vincenzo',
        age: '36',
        location: 'London'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert user', err);
        }
        console.log(JSON.stringify(result, undefined, 2));
    });


    client.close();

});
