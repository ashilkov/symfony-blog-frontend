import type { Post, PostExtended, PostResponse } from "./types";
import { graphql } from "./http";

export async function createPost(input: {
  title: string;
  content: string;
  blog: string;
}): Promise<Post> {
  const MUTATION = `mutation CreatePost($input: createPostInput!) {
        createPost(input: $input) {
            post { _id id title content }
        }
    }`;
  // Backend expects relation field as blog (IRI or ID as per schema)
  input.blog = "/api/blogs/" + input.blog;
  const variables = {
    input: { title: input.title, content: input.content, blog: input.blog },
  } as const;
  const result = await graphql<{ createPost: { post: Post } }>(
    MUTATION,
    variables
  );
  return result.createPost.post;
}

export async function editPost(input: {
  id: string;
  title: string;
  content: string;
}): Promise<Post> {
  const MUTATION = `mutation editPost($input: editPostInput!) {
      editPost(input: $input) {
          post { _id id title content }
      }
  }`;
  input.id = "/api/posts/" + input.id;
  const variables = {
    input: { title: input.title, content: input.content, id: input.id },
  } as const;
  const result = await graphql<{ editPost: { post: Post } }>(
    MUTATION,
    variables
  );
  return result.editPost.post;
}

export async function fetchPosts(): Promise<PostExtended[]> {
  const QUERY = `query Posts {
        posts {
            edges { node { _id id title content blog { _id id name } } }
        }
    }`;
  const result = await graphql<{ posts: { edges: { node: PostExtended }[] } }>(
    QUERY
  );

  return (result.posts?.edges ?? []).map((e) => {
    return e.node;
  });
}

// fetch posts related to blog
export async function fetchBlogPosts(blogId: string): Promise<PostExtended[]> {
  const QUERY = `query Posts($blogId: ID!) {
        posts (blog_id: $blogId) {
            edges { node { _id id title content blog { _id id name } } }
        }
    }`;
  const variables = { blogId: blogId };
  const result = await graphql<{ posts: { edges: { node: PostExtended }[] } }>(
    QUERY,
    variables
  );

  return (result.posts?.edges ?? []).map((e) => {
    return e.node;
  });
}

export async function fetchPost(id: string): Promise<PostExtended> {
  const QUERY = `query Post ($id: ID!) {
        post (id: $id) {
            _id id title content createdAt author allowedActions blog { _id id name } comments {edges {node {_id id content author createdAt updatedAt}}}
        }
    }`;
  const variables = { id: "api/posts/" + id };
  const result = await graphql<{ post: PostResponse }>(QUERY, variables);

  const post = result.post;
  if (!post) throw new Error("Post not found");

  const comments = (post.comments?.edges ?? []).map((edge: { node: any }) => {
    return edge.node;
  });

  return {
    ...post,
    comments,
  };
}

export async function generatePost(
  title?: string,
  content?: string,
  blogId?: string
): Promise<Post> {
  const QUERY = `query generatePost($title: String, $content: String, $blogId: String!) {
      generatePost(title: $title, content: $content, blogId: $blogId) {
          title content
      }
  }`;
  const variables = { title: title, content: content, blogId: blogId };
  const result = await graphql<{ generatePost: Post }>(QUERY, variables);

  return result.generatePost;
}
