"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.typeDefs = (0, graphql_tag_1.gql) `
  type User {
    id: String
    username: String
  }

  type Query {
    users: [User]
    user(username: String): User
    me: User
  }

  type Mutation {
    signup(username: String!, password: String!): User
    login(username: String!, password: String!): Boolean
    logout: Boolean    
    analyzeProblem(problemText: String!): String
  }
`;
