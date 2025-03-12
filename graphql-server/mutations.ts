import { gql } from "@apollo/client/core";

export const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $password: String!) {
    signup(username: $username, password: $password) {
      username
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

export const ANALYZE_PROBLEM_MUTATION = gql`
  mutation AnalyzeProblem($problemText: String!) {
    analyzeProblem(problemText: $problemText)
  }
`;
