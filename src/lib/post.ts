import type { Post, PostExtended } from "./types";
import { graphql } from "./http";
import { getIdFromIri } from "./api_helper";

export async function createPost(input: {
  title: string;
  content: string;
  blog: string;
}): Promise<Post> {
  const MUTATION = `mutation CreatePost($input: createPostInput!) {
        createPost(input: $input) {
            post { id title content }
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

export async function fetchPosts(): Promise<PostExtended[]> {
  const QUERY = `query Posts {
        posts {
            edges { node { id title content blog { id name } } }
        }
    }`;
  const result = await graphql<{ posts: { edges: { node: PostExtended }[] } }>(
    QUERY
  );

  return (result.posts?.edges ?? []).map((e) => {
    const node = e.node;
    return {
      ...node,
      id: getIdFromIri(node.id),
      blog: node.blog
        ? { ...node.blog, id: getIdFromIri(node.blog?.id) }
        : node.blog,
    };
  });
}

// fetch posts related to blog
export async function fetchBlogPosts(blogId: string): Promise<PostExtended[]> {
  const QUERY = `query Posts($blogId: ID!) {
        posts (blog_id: $blogId) {
            edges { node { id title content blog { id name } } }
        }
    }`;
  const variables = { blogId: blogId };
  const result = await graphql<{ posts: { edges: { node: PostExtended }[] } }>(
    QUERY,
    variables
  );

  return (result.posts?.edges ?? []).map((e) => {
    const node = e.node;
    return {
      ...node,
      id: getIdFromIri(node.id),
      blog: node.blog
        ? { ...node.blog, id: getIdFromIri(node.blog?.id) }
        : node.blog,
    };
  });
}

export async function fetchPost(id: string): Promise<PostExtended> {
  const QUERY = `query Post ($id: ID!) {
        post (id: $id) {
            id title content createdAt blog { id name } author
        }
    }`;
  const variables = { id: "api/posts/" + id };
  const result = await graphql<{ post: PostExtended }>(QUERY, variables);

  const post = result.post;
  if (!post) throw new Error("Post not found");

  return {
    ...post,
    id: getIdFromIri(post.id),
    blog: post.blog
      ? { ...post.blog, id: getIdFromIri(post.blog.id) }
      : post.blog,
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
