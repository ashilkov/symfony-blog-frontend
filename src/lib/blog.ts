import type { Blog, BlogExtended, BlogResponse } from "./types";
import { graphql } from "./http";

const api_path = "api/blogs/";

export async function createBlog(input: {
  name: string;
  description: string;
}): Promise<Blog> {
  // Note: schema expects lowercased createBlogInput
  const MUTATION = `mutation CreateBlog($input: createBlogInput!) {
        createBlog(input: $input) {
            blog { _id id name description }
        }
    }`;
  const result = await graphql<{ createBlog: { blog: Blog } }>(MUTATION, {
    input,
  });
  return result.createBlog.blog;
}

export async function fetchBlogs(): Promise<Blog[]> {
  // Adjusted for cursor connection shape
  const QUERY = `query Blogs {
        blogs {
            edges { node { _id id name description subscribed blogUsers {edges {node {role}}}}}
        }
    }`;
  const result = await graphql<{ blogs: { edges: { node: Blog }[] } }>(QUERY);
  return (result.blogs?.edges ?? []).map((e) => {
    return e.node;
  });
}

export async function fetchBlog(id: string): Promise<BlogExtended> {
  const QUERY = `query Blog ($id: ID!) {
        blog (id: $id) {
            _id id name description posts {edges {node {_id id title content}}} blogUsers {edges {node {role}}}
        }
    }`;
  const variables = { id: api_path + id };
  const result = await graphql<{ blog: BlogResponse }>(QUERY, variables);

  const blog = result.blog;
  if (!blog) throw new Error("Blog not found");

  const posts = (blog.posts?.edges ?? []).map((edge: { node: any }) => {
    return edge.node;
  });

  const blogUsers = (blog.blogUsers?.edges ?? []).map((edge: { node: any }) => {
    return edge.node;
  });

  return {
    ...blog,
    posts,
    blogUsers,
  };
}

export async function generateBlog(
  name?: string,
  description?: string
): Promise<Blog> {
  const QUERY = `query generateBlog($name: String, $description: String) {
        generateBlog(name: $name, description: $description) {
            name description
        }
    }`;
  const variables = { name: name, description: description };
  const result = await graphql<{ generateBlog: Blog }>(QUERY, variables);

  return result.generateBlog;
}

export async function deleteBlog(input: { id: string }): Promise<boolean> {
  const MUTATION = `mutation deleteBlog($input: deleteBlogInput!) {
    deleteBlog(input: $input) {
      blog {
        id
      }
    }
  }`;
  const variables = {
    input: { id: "/api/blogs/" + input.id },
  } as const;
  const result = await graphql<{ deleteBlog: { blog: Blog } }>(
    MUTATION,
    variables
  );
  return result.deleteBlog.blog !== null;
}

