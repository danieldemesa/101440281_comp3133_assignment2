const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { graphqlUploadExpress } = require('graphql-upload');
const typeDefs = require('../src/typeDefs');
const resolvers = require('../src/resolvers');

module.exports = async (req, res) => {
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

  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('✅ MongoDB connected');
  }).catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });

  return app(req, res);
};
