import CommentDto from "./CommentDto";

export default class PostDto {
    id: string;
    title: string;
    content: string;
    author: string;
    dateCreated: Date;
    tags: Set<string>;
    likes: number;
    comments: CommentDto[];

    constructor(id: string, title: string, content: string, author: string, dateCreated: Date, tags: Set<string>, likes: number, comments: CommentDto[]) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
        this.dateCreated = dateCreated;
        this.tags = tags;
        this.likes = likes;
        this.comments = comments;
    }
}