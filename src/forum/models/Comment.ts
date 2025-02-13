export default class Comment {
    user:string
    message:string
    dateCreated:Date
    likes:number

    constructor(user: string, message: string, likes: number) {
        this.user = user;
        this.message = message;
        this.dateCreated = new Date();
        this.likes = likes;
    }

}