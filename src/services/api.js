import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'https://api.code-challenge.ze.delivery/public/graphql'
});

export default client;