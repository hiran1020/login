import { gql } from 'apollo-boost';

export const GET_TOKEN = gql`
  query {
    login(email: "test@email.com", password: "password") {
      userId
      token
      tokenExpiration
    }
  }
`;
