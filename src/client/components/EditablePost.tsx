/** @jsx jsx **/
import { jsx } from '@emotion/core';
import { useState } from 'react';
import { Card, Button, Layout, TextField } from '@cainc/cauliflower';

export const EditablePost = ({
  title,
  content,
  onChange,
}: {
  title: string;
  content: string;
  onChange: (post: Schema.PostCreateInput) => void;
}) => {
  const [post, setPost] = useState({ title, content });
  return (
    <Card theme="grey_v1" css={{ padding: 6 }}>
      <TextField
        value={post.title}
        placeholder="title"
        onChange={(title: string) => setPost({ ...post, title })}
        css={{ margin: 6 }}
      />
      <TextField
        value={post.content}
        placeholder="content"
        onChange={(content: string) => setPost({ ...post, content })}
        css={{ margin: 6 }}
      />
      <Layout css={{ justifyContent: 'flex-end' }}>
        <Button onClick={() => onChange(post)} theme="primary" css={{ margin: 6 }}>
          Submit
        </Button>
      </Layout>
    </Card>
  );
};
