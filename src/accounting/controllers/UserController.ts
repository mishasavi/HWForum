import {Body, Controller, Delete, Get, HeaderParam, Param, Post, Put, Req, Res, UseBefore} from "routing-controllers";
import NewUserDto from "../dto/NewUserDto";
import UserService from "../service/UserService";
import UserServiceImpl from "../service/UserServiceImpl";
import {Response} from 'express';
import {AuthMiddleware} from "../Middleware/AuthMiddleware";
import AuthRequest from "../dto/AuthRequest";

@Controller('/account')
export default class UserController {

    userService: UserService = new UserServiceImpl();

    //может любой
    @Post("/register")
    async register(@Body() newUserDto: NewUserDto) {
        return this.userService.register(newUserDto);
    }

    //может любой
    @Post("/login")
    async login(@HeaderParam('Authorization') token: string, @Res() res: Response) {
        return await this.userService.login(token);
    }

    @UseBefore(AuthMiddleware)
    @Delete('/user/:login')
    async removeUserByLogin(@Param('login') login: string, @Req() request: AuthRequest, @Res() res: Response) {
        const { user } = request;
        const isOwner = user.roles.includes("owner");
        const isAdmin = user.roles.includes("Administrator");
        const isSelf = user.login === login;
        if (!isOwner && !isSelf && !isAdmin) {
            return res.status(403).send("You can only delete your own profile");
        }
        return await this.userService.removeUserByLogin(login).catch((err: any) => res.status(404).send(err));
    }

    //залогиненный пользователь может смотреть любого другого
    @UseBefore(AuthMiddleware)
    @Get('/user/:login')
    async getUserByLogin(@Param('login') login: string, @Res() res: Response) {
        return await this.userService.getUserByLogin(login).catch((err: any) => res.status(404).send(err));
    }

    //Опять у нас аутентификация в Get-запросе, но его ещё и в эндпоинтах нет
    @Get('/users')
    async getAllUser(@Res() res: Response) {
        return await this.userService.getAllUser().catch((err: any) => res.status(404).send(err));
    }

    //изменить имя и фамилию может либо пользователель, либо владелец
    @UseBefore(AuthMiddleware)
    @Put('/user/:login')
    async updateUser(@Param('login') login: string, @Body() updateUserDto: NewUserDto, @Req() request: AuthRequest, @Res() res: Response) {
        const { user } = request;
        const isOwner = user.roles.includes("owner");
        const isSelf = user.login === login;
        if (!isOwner && !isSelf) {
            return res.status(403).send("You can only update your own profile");
        }
        return await this.userService.updateUser(login, updateUserDto.firstName, updateUserDto.lastName).catch((err: any) => res.status(404).send(err));
    }

    //добавить роль может только админ
    @UseBefore(AuthMiddleware)
    @Put('/user/:login/role/:role')
    async addUserRole(@Param('login') login: string, @Param('role') role: string, @Req() request : AuthRequest, @Res() res: Response) {
        const { user } = request;
        const isAdmin = user.roles.includes("Administrator");
        if (!isAdmin) {
            return res.status(403).send("Only admin can add a role");
        }
        return await this.userService.addUserRole(login, role).catch((err: any) => res.status(404).send(err));
    }

    //удалить роль может только админ
    @UseBefore(AuthMiddleware)
    @Delete('/user/:login/role/:role')
    async removeRole(@Param('login') login: string, @Param('role') role: string, @Req() request: AuthRequest, @Res() res: Response) {
        const { user } = request;
        const isAdmin = user.roles.includes("Administrator");
        if (!isAdmin) {
            return res.status(403).send("Only admin can delete a role");
        }
        return await this.userService.removeRole(login, role).catch((err: any) => res.status(404).send(err));
    }

}