const express = require('express');
const Users = require('./userDb.js');
const Posts = require('../posts/postDb.js');

const userRouter = express.Router();
userRouter.use(express.json());

userRouter.post('/', validateUser, (req, res) => {
    
    Users.insert(req.body)
    .then(user => {
        res.status(201).json(user);
    })
    .catch(err => {
        res.status(500).json({ errormessage: "Could not post to /" });
    })
});

userRouter.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    console.log(req.body);
    const postInfo = req.body;
    const { id } = req.params;
    console.log(id);
    Posts.insert(postInfo)
        .then(post => {
            res.status(201).json(post);
            console.log(post);
        })
        .catch(err => {
            res.status(500).json({ message: "Could not create new post for user" });
        })
    

});

userRouter.get('/', (req, res) => {
    Users.get()
    .then(user => {
        res.status(200).json(user);
    })
    .catch(err => {
        res.status(500).json({ errormessage: "error getting users" });
    })
});

userRouter.get('/:id', validateUserId, (req, res) => {
    // const { id } = req.params;
    // Users.getById(id)
    // .then(user => {
    //     res.status(200).json(user);
    // })
    // .catch(err => {
    //     res.status(500).json({ errormessage: "error getting specific user "});
    // })
   res.status(200).json(req.user);
});

userRouter.get('/:id/posts', validateUserId, (req, res) => {
const userId= req.params.id;

Users.getUserPosts(userId)
    .then(user => {
        res.status(200).json(user);
    })
    .catch(err => {
        res.status(500).json({ errormessage: "error getting user posts" });
    })
});

userRouter.delete('/:id', validateUserId, (req, res) => {
    const { id } = req.params;
    Users.remove(id)
    .then(removed => {
        res.status(200).json(removed);
    })
    .catch(err => {
        res.status(500).json({errormessage: "error deleting user" });
    })
});

userRouter.put('/:id', validateUserId, (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    Users.update(id, changes)
    .then(updated => {
        res.status(200).json(updated);
    })
    .catch(err => {
        res.status(500).json({ errormessage: "error updating "})
    })
});

//custom middleware

function validateUserId(req, res, next) {
    
    const userId = req.params.id;
   
    // console.log(req.params);
    // console.log(req.params.id);
    // console.log(req.path);
    
    Users.getById(userId)
    .then(user => {
        if(user){
            // res.status(200).json(user);
            req.user = user;
            next();
        } else {
            res.status(400).json({ message: "invalid user id" });
        }
    })
    // if (userId) {
    //    next();
    // } else {
    //   res.status(400).json({ message: "invalid user id" })
    // }
  
    
};
//- `validateUser` validates the `body` on a request to create a new user

function validateUser(req, res, next) {
    const userInfo = req.body;
    if(!userInfo){
        res.status(400).json({ message: "missing user data" })
    } else if(!userInfo.name) {
        res.status(400).json({ message: "missing required name field" })
    } else {
        next();
    }
};

function validatePost(req, res, next) {
    const postInfo = req.body;
    if(!postInfo){
        res.status(400).json({ message: "missing post data" });
    } else if (!postInfo.text || !postInfo.user_id){
        res.status(400).json({ message: "missing required text field or user ID" });
    } else {
        next();
    }

};

module.exports = userRouter;
