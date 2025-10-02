export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  fullname: string | undefined;
  email: string;
  password: string;
}

export type User = {
  _id: number;
  id: string | null;
  username: string;
  email: string;
  fullname: string;
};

export type Blog = {
  _id: number;
  id: string;
  name: string;
  description: string;
  subscribed: boolean;
};

export type BlogExtended = Blog & {
  posts?: Post[];
};

export type Post = {
  _id: number;
  id: string;
  title: string;
  content: string;
  author: string;
  allowedActions: string[];
  createdAt: string;
  updatedAt: string;
};

export type PostExtended = Post & {
  blog?: Blog;
  comments?: Comment[];
};

export type Subscription = {
  _id: number;
  id: string;
  userId: string;
  blogId: string;
};

export type Comment = {
  _id: number;
  id: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
};
// responses

export type BlogResponse = Blog & {
  posts: Collection;
};

export type PostResponse = Post & {
  comments: Collection;
};

export type Collection = {
  edges: Array<{
    node: any;
  }>;
};
