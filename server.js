const express = require('express');
const postsRouter = require('./posts/postRouter.js');
const usersRouter = require('./users/userRouter.js');

const server = express();
server.use(express.json());
server.get('/', (req, res) => {
  res.send(process.env.TM);
 
});

//custom middleware

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}]${req.method} to ${req.path}` )

  next();
};


//global middleware calls
server.use(logger);

server.use('/api/posts', postsRouter);
server.use('/api/users', usersRouter); //REMEMBER THE FIRST /

module.exports = server;
