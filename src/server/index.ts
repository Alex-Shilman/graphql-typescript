import { GraphQLServer, Options } from 'graphql-yoga';
import { Request } from 'express';
import { fromGlobalId, toGlobalId } from 'graphql-relay';

interface Context {
  request: Request;
}

let nextId = 1e6;

interface Table<T extends Schema.Node> {
  [key: string]: T;
}

const createIdField = (nodeType: string) => (id: string) => toGlobalId(nodeType, id);

const postIdField = createIdField('posts');

const posts: Table<Schema.Post> = {
  [postIdField('test')]: {
    id: postIdField('test'),
    title: 'Hello',
    content: 'World!',
  },
};

const nodes: { [key: string]: Table<Schema.Node> } = {
  posts,
};

const findNodeById = (nodeId: string): Schema.Node => {
  const { type, id } = fromGlobalId(nodeId);
  return nodes[type][id];
};

const findPosts = (where?: Schema.PostWhereInput) => {
  const { id } = where || { id: null };
  const allValues = !Boolean(where);
  const allPosts = Object.values(posts);
  return allValues ? allPosts : allPosts.filter(({ id: postId }) => postId === id);
};

const resolvers: Schema.Resolver = {
  Node: {
    __resolveType(obj, ctx, info) {
      return <any>fromGlobalId(obj.id).type;
    },
  },
  Query: {
    posts(_, { where } = {}, context: Context) {
      return findPosts(where);
    },
    node(_, { id }, context: Context) {
      return findNodeById(id);
    },
  },
  Mutation: {
    createPost(_, { data: { title = '', content = '' } }, context: Context) {
      const id = postIdField(String(nextId++));
      const post: Schema.Post = {
        id,
        title,
        content,
      };
      posts[id] = post;
      return post;
    },
    updatePost(_, { where, data: { title = '', content = '' } }, context: Context) {
      const foundPosts = findPosts(where);
      if (foundPosts.length !== 1) {
        return;
      }
      const post: Schema.Post = foundPosts[0];
      posts[post.id] = {
        ...post,
        title,
        content,
      };
      return post;
    },
    deletePost(_, { where }, context: Context) {
      const foundPosts = findPosts(where);
      if (foundPosts.length !== 1) {
        return;
      }
      const post: Schema.Post = foundPosts[0];
      delete posts[post.id];
      return post;
    },
  },
};

const server = new GraphQLServer({
  typeDefs: './schema/schema.graphql',
  resolvers: <any>resolvers,
  context: (request: Request) => ({ request }),
});

server.start(
  {
    endpoint: '/graphql',
  },
  (options: Options) => console.log(`Server is running on http://localhost:${options.port}`),
);
