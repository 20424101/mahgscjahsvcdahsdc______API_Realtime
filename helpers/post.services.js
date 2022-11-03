import { nanoid } from 'nanoid';

export default createNotification = ({ postId, authorId, userId }) => {
  return {
    id: nanoid(),
    userId: authorId,
    title: `Your post has been liked by user ${userId}`,
    type: "post",
    meta: {
      id: postId,
    },
  };
};