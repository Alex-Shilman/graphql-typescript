import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { ListPostsQuery } from '../components/ListPosts';
import { ApolloError } from 'apollo-boost';

const mutation = gql`
  mutation UpdatePostMutation($where: PostWhereInput!, $data: PostCreateInput!) {
    updatePost(where: $where, data: $data) {
      id
    }
  }
`;

let tempID = 0;

export default ({
  children,
}: {
  children: (
    commit: (where: Schema.PostWhereInput, data: Schema.PostCreateInput) => void,
    { error, loading }: { error: ApolloError | undefined; loading: boolean },
  ) => React.ReactNode;
}) => {
  let input;

  return (
    <Mutation mutation={mutation}>
      {(mutate, { error, loading }) =>
        children(
          (where: Schema.PostWhereInput, data: Schema.PostCreateInput): React.ReactNode =>
            mutate({
              variables: { where, data },
              optimisticResponse: {
                __typename: 'Mutation',
                updatePost: {
                  id: where.id,
                  __typename: 'Post',
                  title: data.title,
                  content: data.content,
                },
              },
              update: (proxy, { data: { createPost } }) => {
                const queryResult = proxy.readQuery<Schema.Query>({ query: ListPostsQuery });
                if (queryResult) {
                  const post = queryResult.posts.find(post => !!(post && post.id === where.id));
                  if (post) {
                    post.title = data.title;
                    post.content = data.content;
                    proxy.writeQuery({ query: ListPostsQuery, data: queryResult });
                  }
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
