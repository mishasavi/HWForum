import {Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseBefore} from "routing-controllers";
import NewPostDto from "../dto/NewPostDto";
import PostService from "../service/PostService";
import PostServiceImpl from "../service/PostServiceImpl";
import {Response} from 'express';
import CommentDto from "../dto/CommentDto";
import {AuthMiddleware} from "../../accounting/Middleware/AuthMiddleware";
import AuthRequest from "../../accounting/dto/AuthRequest";


@Controller('/forum')
export default class PostController {

    postService:PostService = new PostServiceImpl();

    //только при совпадении логина и автора
    @UseBefore(AuthMiddleware)
    @Post("/post/:author")
    async createPost(@Param('author') author:string, @Req() request: AuthRequest, @Res() res: Response, @Body() newPostDto: NewPostDto){
        const { user } = request;
        const isSelf = user.login === author;
        if (!isSelf) {
            return res.status(403).send("You can only create your own posts");
        }
        return await this.postService.createPost(author,newPostDto.title , newPostDto.content, newPostDto.tags);
    }

    //пройти аутентификацию в Get запросе это сверхзадача! пока пас
    @Get("/post/:id")
    async findPostById(@Param('id') id:string, @Res() res: Response){
        return await this.postService.findPostById(id).catch(err => res.status(404).send(err));
    }

    //залогиненный автор поста, владелец
    @UseBefore(AuthMiddleware)
    @Put("/post/:id")
    async updatePostById(@Param('id') id:string, @Req() request: AuthRequest, @Res() res: Response, @Body() newPostDto: NewPostDto){
        const { user } = request;
        const post = await this.postService.findPostById(id);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        const isOwner = user.roles.includes("owner");
        const isSelf = user.login === post.author;
        if (!isOwner && !isSelf) {
            return res.status(403).send("You can only update your own posts");
        }

        return await this.postService.updatePostById(id,newPostDto.title , newPostDto.content, newPostDto.tags).catch(err => res.status(404).send(err));
    }

    //залогиненный автор поста, владелец, модератор
    @UseBefore(AuthMiddleware)
    @Delete("/post/:id")
    async removePostById(@Param('id') id:string, @Req() request: AuthRequest, @Res() res: Response){
        const { user } = request;
        const post = await this.postService.findPostById(id);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        const isOwner = user.roles.includes("owner");
        const isModerator = user.roles.includes("Moderator");
        const isSelf = user.login === post.author;
        if (!isOwner && !isSelf && !isModerator) {
            return res.status(403).send("You can only delete your own post");
        }
        return await this.postService.removePostById(id).catch((err: any) => res.status(404).send(err));
    }


    @Get('/posts')
    async getAllPosts(@Res() res: Response) {
        return await this.postService.getAllPosts().catch((err: any) => res.status(404).send(err));
    }

    @Post('/posts/tags')
    async findPostsByTags(@Body() tags: string[]) {
        return await this.postService.findPostsByTags(tags);
    }

    @Post('/posts/period')
    async findPostsByPeriod(@Body() date: { dateFrom: string, dateTo: string }) {
        return await this.postService.findPostsByPeriod(new Date(date.dateFrom), new Date(date.dateTo));
    }

    @Get('/posts/author/:author')
    async findPostsByAuthor(@Param('author') author: string, @Res() res: Response) {
        return await this.postService.findPostsByAuthor(author).catch((err: any) => res.status(404).send(err));
    }

    //коммент добавляет только залогиненный пользователь под своим именем
    @UseBefore(AuthMiddleware)
    @Put('/post/:id/comment/:author')
    async addComment(@Param('id') id: string, @Param('author') author: string, @Req() request: AuthRequest, @Res() res: Response, @Body() commentDto: CommentDto) {
        const { user } = request;
        const isSelf = user.login === author;
        if (!isSelf) {
            return res.status(403).send("You can only comment under your own name");
        }
        return await this.postService.addComment(id, author, commentDto.message).catch((err: any) => res.status(404).send(err));
    }

    //лайк добавляет любой залогиненный пользователь, правда, тогда можно спамить лайки
    //возможное решение -- добавить массив лайкнувших likedBy
    @UseBefore(AuthMiddleware)
    @Put('/post/:id/like')
    async addLike(@Param('id') id: string, @Res() res: Response) {
        return await this.postService.addLike(id).catch((err: any) => res.status(404).send(err));
    }
}