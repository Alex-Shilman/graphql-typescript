import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { ListPostsQuery } from '../components/ListPosts';
import { ApolloError } from 'apollo-boost';

const mutation = gql`
  mutation DeletePostMutation($where: PostWhereInput!) {
    deletePost(where: $where) {
      id
    }
  }
`;

export default ({
  children,
}: {
  children: (
    commit: (where: Schema.PostWhereInput) => void,
    { error, loading }: { error: ApolloError | undefined; loading: boolean },
  ) => React.ReactNode;
}) => {
  let input;

  return (
    <Mutation mutation={mutation}>
      {(mutate, { error, loading }) =>
        children(
          (where: Schema.PostWhereInput): React.ReactNode =>
            mutate({
              variables: { where },
              optimisticResponse: {
                __typename: 'Mutation',
                deletePost: {
                  id: where.id,
                  __typename: 'Post',
                },
              },
              update: (proxy, { data: { createPost } }) => {
                // Read the data from our cache for this query.
                const queryResult = proxy.readQuery<Schema.Query>({ query: ListPostsQuery });
                if (queryResult) {
                  // Add our comment from the mutation to the end.
                  queryResult.posts = queryResult.posts.filter(
                    post => post && post.id !== where.id,
                  );
                  // Write our data back to the cache.
                  proxy.writeQuery({ query: ListPostsQuery, data: queryResult });
                }
              },
            }),
          {
            error,
            loading,
          },
        )
      }
    </Mutation>
  );
};
