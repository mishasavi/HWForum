import {Document, Schema, model} from 'mongoose';

export interface IPost extends Document {
    title: string,
    content: string,
    tags: Set<string>,
    author:string,
    dateCreated:Date,
    likes:number,
    comments:Comment[]
}

const postSchema = new Schema<IPost>(
    {
        title: {type: String, required: true},
        content: {type: String, required: true},
        tags: {type: [String], required: true},
        author:{type: String, required: true},
        dateCreated:{type: Date, required: true, default: Date.now},
        likes:{type: Number, required: true, default: 0},
        comments:{type: [Object], required: true, default:[]},
    }
);

export const Post = model<IPost>('Post', postSchema);