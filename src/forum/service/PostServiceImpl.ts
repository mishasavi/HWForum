import PostService from "./PostService";
import PostDto from "../dto/PostDto";
import {Post as P} from "../models/Post";
import CommentDto from "../dto/CommentDto";
import {NotFoundError} from "routing-controllers";

export default class PostServiceImpl implements PostService {

    async createPost(author: string, title: string, content: string, tags: Set<string>): Promise<PostDto> {
        const newPost = new P({
            title: title,
            content: content,
            tags: tags,
            author: author
        });
        const res = (await newPost.save());
        // return res.toObject({flattenObjectIds: true}) as PostDto;
        return new PostDto(res.id, res.title,
            res.content, res.author, res.dateCreated,
            res.tags, res.likes, res.comments.map(c => c as unknown as CommentDto));
    }

    async findPostById(id: string): Promise<PostDto> {
        const post = await P.findById(id);
        if(post === null){
            throw new Error("post is null")
        }
        return new PostDto(post.id, post.title,
            post.content, post.author, post.dateCreated,
            post.tags, post.likes, post.comments.map(c => c as unknown as CommentDto));
    }

    async updatePostById(id: string, title:string, content:string, tags: Set<string>): Promise<PostDto> {
        const post = await P.findById(id);
        if(post === null){
            throw new Error("post is null")
        }
        post.title = title;
        post.content = content;
        post.tags = tags;
        await post.save();
        return new PostDto(post.id, post.title,
            post.content, post.author, post.dateCreated,
            post.tags, post.likes, post.comments.map(c => c as unknown as CommentDto));
    }

    async addComment(id: string, user: string, message: string): Promise<PostDto> {
        const post = await P.findByIdAndUpdate(
            id,
            {
                $push: {
                    comments: {
                        user,
                        message,
                        likes: 0,
                    },
                },
            },
            { new: true }
        );
        if(post === null){
            throw new Error("post is null")
        }

        return new PostDto(post.id, post.title,
            post.content, post.author, post.dateCreated,
            post.tags, post.likes, post.comments.map(c => c as unknown as CommentDto));
    }

    async addLike(id: string): Promise<PostDto> {
        const post = await this.findById(id);
        post.likes += 1;
        await post.save();
        return new PostDto(post.id, post.title,
            post.content, post.author, post.dateCreated,
            post.tags, post.likes, post.comments.map(c => c as unknown as CommentDto));
    }

    async findPostsByAuthor(author: string): Promise<PostDto[]> {
        const posts = await P.find({ author });
        if (posts.length === 0) {
            throw new NotFoundError(`No posts found for author: ${author}`);
        }
        return posts.map(post => {
            return new PostDto(post.id, post.title, post.content, post.author, post.dateCreated, post.tags, post.likes,
                post.comments.map(c => c as unknown as CommentDto)
            );
        });
    }

    async findPostsByPeriod(dateFrom: Date, dateTo: Date): Promise<PostDto[]> {
        const posts = await P.find({
            dateCreated: { $gte: dateFrom, $lte: dateTo },
        });
        return posts.map(post => {
            return new PostDto(post.id, post.title, post.content, post.author, post.dateCreated, post.tags, post.likes,
                post.comments.map(c => c as unknown as CommentDto)
            );
        });
    }

    async findPostsByTags(tags: string[]): Promise<PostDto[]> {
        const posts = await P.find({ tags: { $in: tags } });
        return posts.map(post => {
            return new PostDto(post.id, post.title, post.content, post.author, post.dateCreated, post.tags, post.likes,
                post.comments.map(c => c as unknown as CommentDto)
            );
        });
    }

    async getAllPosts(): Promise<PostDto[]> {
        const posts = await P.find();
        if (posts.length === 0) {
            throw new NotFoundError("No posts found");
        }
        return posts.map(post => {
            return new PostDto(post.id, post.title, post.content, post.author, post.dateCreated, post.tags, post.likes,
                post.comments.map(c => c as unknown as CommentDto)
            );
        });
    }

    async removePostById(id: string): Promise<PostDto> {
        const post = await this.findPostById(id);
        await P.findByIdAndDelete(id);
        return new PostDto(post.id, post.title,
            post.content, post.author, post.dateCreated,
            post.tags, post.likes, post.comments.map(c => c as unknown as CommentDto));
    }

    private async findById(id: string){
        const post = await P.findById(id);
        if(post === null){
            throw new Error("post is null")
        }
        return post;
    }
}