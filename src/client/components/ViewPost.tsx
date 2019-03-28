/** @jsx jsx **/
import { jsx } from '@emotion/core';
import { useState } from 'react';
import { Card, Button, IconButton, Layout } from '@cainc/cauliflower';
import { EditablePost } from './EditablePost';
import UpdatePostMutation from '../mutations/UpdatePostMutation';
import DeletePostMutation from '../mutations/DeletePostMutation';

const ReadPost = ({
  post,
  onEnterEdit,
  onDelete,
}: {
  post: Schema.Post;
  onEnterEdit: () => void;
  onDelete: () => void;
}) => (
  <Card theme="grey_v1" css={{ padding: 6 }}>
    <h1>{post.title}</h1>
    <p>{post.content}</p>
    <Layout css={{ justifyContent: 'flex-end' }}>
      <Button onClick={onEnterEdit} theme="primary" css={{ margin: 6 }}>
        Edit
      </Button>
      <IconButton
        onClick={onDelete}
        theme="secondary"
        icon="delete-x"
        className="icon-only"
        css={{ margin: 6 }}
      />
    </Layout>
  </Card>
);

export const ViewPost = ({ post }: { post: Schema.Post }) => {
  const [editing, setEditing] = useState(false);
  return editing ? (
    <UpdatePostMutation>
      {update => (
        <EditablePost
          title={post.title}
          content={post.content}
          onChange={input => {
            setEditing(false);
            update({ id: post.id }, input);
          }}
        />
      )}
    </UpdatePostMutation>
  ) : (
    <DeletePostMutation>
      {deletePost => (
        <ReadPost
          post={post}
          onEnterEdit={() => setEditing(true)}
          onDelete={() => deletePost(post)}
        />
      )}
    </DeletePostMutation>
  );
};
