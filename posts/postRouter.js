const express = require('express');
const Posts = require('./postDb.js');

const postRouter = express.Router();

postRouter.use(express.json());

postRouter.get('/', (req, res) => {
    Posts.get()
    .then(post => {
        res.status(200).json(post);
    })
    .catch(err => {
        res.status(500).json({ errormessage: "could not get posts" });
    })
});

postRouter.get('/:id', (req, res) => {

});

postRouter.delete('/:id', (req, res) => {

});

postRouter.put('/:id', (req, res) => {

});

// custom middleware

function validatePostId(req, res, next) {

};

module.exports = postRouter;