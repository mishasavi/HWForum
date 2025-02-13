export function encodeBase64(password:string):string{
    let pass = Buffer.from(password).toString('base64');
    return pass;
}

export function decodeBase64(encodePassword:string):string{
    let decodePass = Buffer.from(encodePassword,'base64').toString('utf-8');
    return decodePass;
}