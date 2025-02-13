import NewUserDto from "../dto/NewUserDto";
import UserDto from "../dto/UserDto";

export default interface UserService {

    register(newUserDto: NewUserDto): Promise<UserDto>;

    removeUserByLogin(login: string) : Promise<UserDto>;

    getUserByLogin(login: string) : Promise<UserDto>;

    getAllUser(): Promise<UserDto[]>;

    updateUser(login: string, firstName: string, lastName: string): Promise<UserDto>;

    addUserRole(login: string, role: string) : Promise<UserDto>;

    removeRole(login: string, role: string): Promise<UserDto>;

    login(token: string): Promise<UserDto>;
}