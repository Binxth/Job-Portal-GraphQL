const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const {ApolloServer, gql} = require('apollo-server-express');
const fs = require('fs');

const PORT = 9000;
const jwtSecret = Buffer.from('Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt', 'base64');

const app = express();
app.use(cors(), bodyParser.json(), expressJwt({
  secret: jwtSecret,
  credentialsRequired: false
}));



//reading the schema using fs and encoding to string, otherwise will be binary
const schema = fs.readFileSync('schema.graphql', {encoding: 'utf-8'});

const typeDefs = 
  gql(schema);

//importing resolver from resolvers.js
const resolvers = require('./resolvers')

const apolloServer =  new  ApolloServer({typeDefs, resolvers})
apolloServer.start().then(()=>{
  apolloServer.applyMiddleware({app, path: '/graphql'});
  console.log("apollo server started");
});

// async function startApolloServer() {
//   const apolloServer =  new  ApolloServer({typeDefs, resolvers})
//   await apolloServer.start();
//   apolloServer.applyMiddleware({app, path: '/graphql'});
// }
// startApolloServer();


app.post('/login', (req, res) => {
  const {email, password} = req.body;
  const user = db.users.list().find((user) => user.email === email);
  if (!(user && user.password === password)) {
    res.sendStatus(401);
    return;
  }
  const token = jwt.sign({sub: user.id}, jwtSecret);
  res.send({token});
});

app.listen(PORT, () => console.info(`Server started on port ${PORT}`));
