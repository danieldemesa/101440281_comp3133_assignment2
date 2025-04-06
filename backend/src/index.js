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

  // 1. CORS should come first
  app.use(cors());

  // 2. File upload middleware BEFORE apollo-server-express handles anything
  app.use(graphqlUploadExpress({ maxFileSize: 10_000_000, maxFiles: 1 }));

  // 3. Serve static files (uploaded images)
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  // 4. Apollo Server setup
  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 5000;

  // 5. Connect to MongoDB and start app
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
