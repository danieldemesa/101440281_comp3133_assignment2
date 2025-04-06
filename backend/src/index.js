const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { graphqlUploadExpress } = require('graphql-upload');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

async function startServer() {
  const app = express();

  
  app.use(cors());

  
  app.use(graphqlUploadExpress({ maxFileSize: 10_000_000, maxFiles: 1 }));

 
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  
  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 5000;

  
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
  }).catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });
}

startServer();
