import {ExpressMiddlewareInterface, ForbiddenError, NotFoundError} from "routing-controllers";
import {decodeBase64, encodeBase64} from "../utils/utilsForPassword";
import {User} from "../model/User";


export class AuthMiddleware implements ExpressMiddlewareInterface {
    async use(request: any, response: any, next: (err?: any) => any): Promise<any> {
        const token = request.headers["authorization"];
        if (!token) {
            return response.status(401).send("Access denied");
        }

        const [login, password] = decodeBase64((token.split(" "))[1]).split(":");
        const user = await User.findOne({login: login});
        if (user === null) {
            return response.status(404).send("Not found")
        }
        const pass = user!.password;
        const encodePass = encodeBase64(password);
        if (pass !== encodePass) {
            return response.status(403).send("Password not valid")
        }

        request.user = {
            login: user.login,
            roles: user.roles
        };

        next();
    }
}