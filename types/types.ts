interface CommentType {
  author?: { name: string; image: string; randomColor: string };
  createdAt: Date;
  content: string;
  likes: string[];
  id: string;
  comments?: CommentType[];
}
