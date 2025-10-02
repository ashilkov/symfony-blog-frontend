import type { Comment } from "./types";
import { graphql } from "./http";

export async function createComment(input: {
  content: string;
  postId: number;
}): Promise<Comment> {
  const MUTATION = `mutation CreateComment($input: createCommentInput!) {
    createComment(input: $input) {
      comment { _id id content author createdAt updatedAt }
    }
  }`;
  const result = await graphql<{ createComment: { comment: Comment } }>(
    MUTATION,
    {
      input,
    }
  );
  return result.createComment.comment;
}

export async function fetchComment(id: string): Promise<Comment> {
  const QUERY = `query Comment ($id: ID!) {
    comment (id: $id) { _id id content author createdAt updatedAt }
  }`;
  const variables = { id: id };
  const result = await graphql<{ comment: Comment }>(QUERY, variables);
  return result.comment;
}
