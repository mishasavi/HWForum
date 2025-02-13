export default class UserDto {
    private _login:string;
    private _firstName:string;
    private _lastName:string;
    private _roles:string[];


    constructor(login: string, firstName: string, lastName: string, roles: string[]) {
        this._login = login;
        this._firstName = firstName;
        this._lastName = lastName;
        this._roles = roles;
    }

    get login(): string {
        return this._login;
    }

    set login(value: string) {
        this._login = value;
    }

    get firstName(): string {
        return this._firstName;
    }

    set firstName(value: string) {
        this._firstName = value;
    }

    get lastName(): string {
        return this._lastName;
    }

    set lastName(value: string) {
        this._lastName = value;
    }

    get roles(): string[] {
        return this._roles;
    }

    set roles(value: string[]) {
        this._roles = value;
    }
}