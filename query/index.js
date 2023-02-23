const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvents = (type, data) => {
    if(type === 'PostCreated'){
        const { id , title } = data;
        posts[id] = {id , title, comments: []};
    }

    if(type === 'CommentCreated'){
        const { id , content, postId, status} = data;

        posts[postId].comments.push({id, content, status});
    }

    if(type === 'CommentUpdated'){
        const { id, postId, status, content } = data;

        const comment = posts[postId].comments.find(comment => {
            return comment.id === id;
        })


        comment.status = status;
        comment.content = content;  
    }
    console.log(posts);
}
//Quick Expam
/*
posts === {
    'j123j42' : {
        id : 'j123j42',
        title : 'post title',
        comments : [
            { id : 'klj3kl' , content : 'comment!'}
        ]
    },
    'k193j52' : {
        id : 'k193j52',
        title : 'post title',
        comments : [
            { id : 'klj3AR' , content : 'comment!'}
        ]
    }
}
*/

app.get('/posts', (req,res) => {
    res.send(posts);
});


app.post('/events', (req,res) => {
    const { type , data } = req.body;
 

    handleEvents(type,data);

    res.send({});
});

app.listen(4002, async () => {
    console.log('Query service Listening on 4002');

    try {
        const res = await axios.get("http://localhost:4005/events");//go ask eventBus all the events happen
        console.log('res>',res.data);
        for (let event of res.data) {
          console.log("Processing event:", event.type);
     
          handleEvents(event.type, event.data);
        }
    } catch (error) {
     
        console.error('error >',error.message);
    }
})