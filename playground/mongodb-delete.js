const {MongoClient, ObjectID} = require('mongodb');

const url = 'mongodb://localhost:27017';

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to Mongo db server');
    }
    console.log('Connected to MondoDB server');

    const db = client.db('TodoApp');

    // db.collection('Todos').deleteMany({text: 'eat lunch'}).then((results) => {
    //     console.log(results);
    // });
    // db.collection('Todos').deleteOne({text: 'eat lunch'}).then((results) => {
    //     console.log(results);
    // });

    db.collection('Todos').findOneAndDelete({completed: false}).then((results) => {
        console.log(results);
    });
    //client.close();

});
