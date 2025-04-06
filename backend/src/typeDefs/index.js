const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Upload

  type User {
    id: ID!
    email: String!
    token: String
  }

  type Employee {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    department: String
    position: String
    profilePic: String
  }

  type Query {
    employees: [Employee]
    getEmployee(id: ID!): Employee
  }

  type Mutation {
    signup(email: String!, password: String!): User
    login(email: String!, password: String!): User

    addEmployee(
      firstName: String!
      lastName: String!
      email: String!
      department: String
      position: String
      profilePic: Upload
    ): Employee

    updateEmployee(
      id: ID!
      firstName: String
      lastName: String
      email: String
      department: String
      position: String
      profilePic: Upload   # ✅ ADD THIS LINE
    ): Employee

    deleteEmployee(id: ID!): String
  }
`;

module.exports = typeDefs;
