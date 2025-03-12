import { gql } from "graphql-tag";

export const typeDefs = gql`
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
