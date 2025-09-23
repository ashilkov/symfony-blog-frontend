export interface LoginPayload {
    username: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export type User = { 
    id: string|null; 
    username: string; 
    email: string; 
    fullname: string 
};

export type Blog = { 
    id: string; 
    name: string; 
    description: string 
};

export type BlogExtended = Blog & {
    posts?: Post[]
}

export type Post = { 
    id: string; 
    title: string; 
    content: string 
    created_at: string
    updated_at: string
};

export type PostExtended = Post & { 
    blog?: Blog
    user?: User
};

// responses

export type BlogResponse = Blog & {
    posts: Collection;
}

export type Collection = {
    edges: Array<{
        node: any
    }>
}

