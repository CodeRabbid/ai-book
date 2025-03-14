export interface CommentInterface {
  author: AuthorInterface;
  createdAt: Date;
  content: string;
  likes: string[];
  id: string;
  comments?: CommentInterface[];
}

export interface SessionInterface {
  user: {
    image: string;
    name: string;
    id: string;
  };
}
export interface UserInterface {
  randomColor?: string | null;
  id: string;
}

export interface PostInterface {
  createdAt: Date;
  picture_url: string;
  story: string;
  likes: string[];
  author: AuthorInterface;
  id: string;
  comments: CommentInterface[];
}

export interface AuthorInterface {
  image: string | null;
  randomColor?: string | null;
  name: string;
  id: string;
}
