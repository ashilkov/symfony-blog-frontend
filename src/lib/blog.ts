import type { Blog, BlogExtended, BlogResponse } from "./types";
import { graphql } from "./http";
import { getIdFromIri } from "./api_helper";

const api_path = "api/blogs/";

export async function createBlog(input: {
  name: string;
  description: string;
}): Promise<Blog> {
  // Note: schema expects lowercased createBlogInput
  const MUTATION = `mutation CreateBlog($input: createBlogInput!) {
        createBlog(input: $input) {
            blog { id name description }
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
            edges { node { id name description blogUsers {edges {node {role}}}}}
        }
    }`;
  const result = await graphql<{ blogs: { edges: { node: Blog }[] } }>(QUERY);
  return (result.blogs?.edges ?? []).map((e) => {
    const node = e.node;
    return {
      ...node,
      id: getIdFromIri(node.id),
    };
  });
}

export async function fetchBlog(id: string): Promise<BlogExtended> {
  const QUERY = `query Blog ($id: ID!) {
        blog (id: $id) {
            id name description posts {edges {node {id title content}}}
        }
    }`;
  const variables = { id: api_path + id };
  const result = await graphql<{ blog: BlogResponse }>(QUERY, variables);

  const blog = result.blog;
  if (!blog) throw new Error("Blog not found");

  const posts = (blog.posts?.edges ?? []).map((edge: { node: any }) => {
    const node = edge.node;
    return {
      ...node,
      id: getIdFromIri(node.id),
    };
  });

  return {
    ...blog,
    id: getIdFromIri(blog.id),
    posts,
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
