import UserService from "./UserService";
import NewUserDto from "../dto/NewUserDto";
import UserDto from "../dto/UserDto";
import {User} from "../model/User";
import {ForbiddenError, NotFoundError} from "routing-controllers";
import {decodeBase64, encodeBase64} from "../utils/utilsForPassword";

export default class UserServiceImpl implements UserService {

    async login(token: string): Promise<UserDto> {
        const [login,password] = decodeBase64((token.split(" "))[1]).split(":");
        const user = await User.findOne({login: login});
        if (user === null) {
            throw new NotFoundError(`User with login ${login} not found`);
        }
        const pass = user.password;
        const encodePass = encodeBase64(password);
        if(pass !== encodePass){
            throw new ForbiddenError(`Password not valid`);
        }
        return new UserDto(user.login,user.firstName,user.lastName, user.roles);
    }

    async register(newUserDto: NewUserDto): Promise<UserDto> {
        const existingUser = await User.findOne({login: newUserDto.login});
        if (existingUser) {
            throw new Error(`User with login "${newUserDto.login}" already exists`);
        }

        let encodePass = encodeBase64(newUserDto.password);
        const newUser = new User({
            ...newUserDto,
            password: encodePass
        });
        const res = await newUser.save();
        return new UserDto(res.login,res.firstName,res.lastName, res.roles);
    }

    async removeUserByLogin(login: string): Promise<UserDto> {

        const user = await User.findOne({login: login});
        if (user === null) {
            throw new NotFoundError(`User with login ${login} not found`);
        }
        await user.deleteOne();
        return new UserDto(user.login, user.firstName, user.lastName, user.roles);
    }

    async getUserByLogin(login: string): Promise<UserDto> {
        const user = await User.findOne({login: login});
        if (user === null) {
            throw new NotFoundError(`User with login ${login} not found`);
        }
        return new UserDto(user.login, user.firstName, user.lastName, user.roles);
    }

    async getAllUser(): Promise<UserDto[]> {
        const users = await User.find();
        if (users.length === 0) {
            throw new NotFoundError('Users not found');
        }
        return users.map(user => {
            return new UserDto(user.login, user.firstName, user.lastName, user.roles);
        });
    }

    async updateUser(login: string, firstName: string, lastName: string): Promise<UserDto> {
        const user = await User.findOneAndUpdate({login: login}, {
            $set: {
                firstName: firstName, lastName: lastName
            }
        }, {new: true});
        if (user === null) {
            throw new NotFoundError(`User with login ${login} not found`);
        }
        return new UserDto(user.login, user.firstName, user.lastName, user.roles);
    }

    async addUserRole(login: string, role: string): Promise<UserDto> {
        const user = await User.findOneAndUpdate({login: login}, {$addToSet: {roles: role}}, {new: true});
        if (user === null) {
            throw new NotFoundError(`User with login ${login} not found`);
        }
        return new UserDto(user.login, user.firstName, user.lastName, user.roles);
    }

    async removeRole(login: string, role: string): Promise<UserDto> {
        const user = await User.findOneAndUpdate({login: login}, {$pull: {roles: role}}, {new: true});
        if (user === null) {
            throw new NotFoundError(`User with login ${login} not found`);
        }
        return new UserDto(user.login, user.firstName, user.lastName, user.roles);
    }
}