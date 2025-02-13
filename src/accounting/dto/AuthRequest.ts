import { Request } from "express";

export default interface AuthRequest extends Request {
    user: {
        login: string;
        roles: string[];
    }
}

