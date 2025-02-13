import {Document, Schema, model} from 'mongoose';

export interface IUser extends Document {
    login:string;
    password:string;
    firstName:string;
    lastName:string;
    roles:string[];
}

const userSchema = new Schema<IUser>(
    {
        login: {type: String, required: true},
        password: {type: String, required: true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        roles: {type: [String], required: true, default:['user']},
    }
);

export const User = model<IUser>('User', userSchema);