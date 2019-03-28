import React, { useState } from 'react';
import CreateMutationPost from '../mutations/CreatePostMutation';
import { EditablePost } from './EditablePost';

export const CreatePost = () => {
  const [key, updateKey] = useState(0);
  return (
    <CreateMutationPost>
      {commit => {
        const onChange = (post: Schema.PostCreateInput) => {
          commit(post);
          updateKey(key + 1);
        };
        return <EditablePost key={key} title="" content="" onChange={onChange} />;
      }}
    </CreateMutationPost>
  );
};
