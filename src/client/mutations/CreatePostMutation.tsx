import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { ListPostsQuery } from '../components/ListPosts';
import { ApolloError } from 'apollo-boost';

const mutation = gql`
  mutation CreatePostMutation($data: PostCreateInput!) {
    createPost(data: $data) {
      id
      title
      content
    }
  }
`;

let tempID = 0;

export default ({
  children,
}: {
  children: (
    commit: (data: Schema.PostCreateInput) => void,
    { error, loading }: { error: ApolloError | undefined; loading: boolean },
  ) => React.ReactNode;
}) => {
  let input;

  return (
    <Mutation mutation={mutation}>
      {(mutate, { error, loading }) =>
        children(
          (data: Schema.PostCreateInput): React.ReactNode =>
            mutate({
              variables: { data },
              optimisticResponse: {
                __typename: 'Mutation',
                createPost: {
                  id: `client:new-todo:${tempID++}`,
                  __typename: 'Post',
                  title: data.title,
                  content: data.content,
                },
              },
              update: (proxy, { data: { createPost } }) => {
                // Read the data from our cache for this query.
                const queryResult = proxy.readQuery<Schema.Query>({ query: ListPostsQuery });
                if (queryResult) {
                  // Add our comment from the mutation to the end.
                  queryResult.posts.push(createPost);
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
