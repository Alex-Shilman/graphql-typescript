import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Loader } from '@cainc/cauliflower';
import { ViewPost } from './ViewPost';

export const ListPostsQuery = gql`
  {
    posts {
      id
      title
      content
    }
  }
`;

export const ListPosts = () => (
  <Query query={ListPostsQuery}>
    {({ loading, error, data }) => {
      if (loading) return <Loader fullScreen={false} />;
      if (error) return <div>{error.message}</div>;

      return data.posts.map((post: Schema.Post) => <ViewPost key={post.id} post={post} />);
    }}
  </Query>
);
