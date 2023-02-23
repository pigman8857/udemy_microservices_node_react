const express = require('express');
const bodyParser = require('body-parser')
const { randomBytes  } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentByPostId = {};

app.get('/posts/:id/comments',(req,res) => {
  res.send(commentByPostId[req.params.id] || []);
});


app.post('/posts/:id/comments',async(req,res) => {
    const commentId = randomBytes(4).toString('hex');
    //k5lk3kca09z46h <<< something like this
    const postId = req.params.id;
    const { content } = req.body;

    const comments = commentByPostId[postId] || [];
    comments.push({ id : commentId, content, status : 'pending' });

    commentByPostId[postId] = comments;

    await axios.post('http://localhost:4005/events', {//event bus
        type: 'CommentCreated',
        data : {
          id : commentId, 
          content,
          postId,
          status : 'pending'
        }
    })

    res.status(201).send(comments);
});

app.post('/events', async(req,res) => {
  console.log(`Received Event ${req.body.type}`);

  const { type , data } = req.body;
  if(type === 'CommentModerated'){
    const {id, postId, status, content } = data;

    const comments = commentByPostId[postId];

    const comment = comments.find(comment => {
      return comment.id === id
    });

    comment.status = status;

    await axios.post('http://localhost:4005/events', {
      type : 'CommentUpdated',
      data: {
        id,
        postId,
        status,
        content
      }
    });
  }

  res.send({});
});

app.listen(4001, () => {
    console.log('Comment service Listening on 4001');
})