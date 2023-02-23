const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];

app.post('/events', (req,res) => {
    const event = req.body;
    console.log('event >',event);

    events.push(event);

    //Posts service
    axios.post('http://localhost:4000/events', event).catch((err) => {
        console.log(err.message);
    });

    //comments service
    axios.post('http://localhost:4001/events', event).catch((err) => {
        console.log(err.message);
    });

    //Query service
    axios.post('http://localhost:4002/events', event).catch((err) => {
        console.log(err.message);
    });

    //Moderation service
    axios.post("http://localhost:4003/events", event).catch((err) => {
        console.log(err.message);
    });

    // //comments service
    // axios.post("http://localhost:4006/events", event).catch((err) => {
    //     console.log(err.message);
    // });
    // //comments service
    // axios.post("http://localhost:4007/events", event).catch((err) => {
    //     console.log(err.message);
    // });

    res.send({status:'OK'});
});

app.get('/events', (req,res) => {
    res.send(events);
})

app.listen(4005, () => {
    console.log('event-bus listening on 4005');
});

