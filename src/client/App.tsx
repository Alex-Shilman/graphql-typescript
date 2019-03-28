import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import { ListPosts } from './components/ListPosts';
import { CreatePost } from './components/CreatePost';

import '@cainc/cauliflower/index.css';

const client = new ApolloClient({
  uri: '/graphql',
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <ListPosts />
          <CreatePost />
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
