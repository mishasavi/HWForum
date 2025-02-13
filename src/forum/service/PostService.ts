import PostDto from "../dto/PostDto";

export default interface PostService {
    createPost(author:string, title:string, content:string, tags: Set<string>): Promise<PostDto>;

    findPostById(id: string): Promise<PostDto>;

    updatePostById(id: string, title:string, content:string, tags: Set<string>): Promise<PostDto>;

    removePostById(id: string): Promise<PostDto>;

    getAllPosts(): Promise<PostDto[]>;

    findPostsByAuthor(author: string): Promise<PostDto[]>;

    addComment(id: string, user: string, message: string): Promise<PostDto>;

    findPostsByTags(tags: string[]): Promise<PostDto[]>;

    findPostsByPeriod(dateFrom: Date, dateTo: Date): Promise<PostDto[]>;

    addLike(id: string): Promise<PostDto>;
}