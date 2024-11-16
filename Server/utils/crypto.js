const crypto = require("crypto");
const utils={};
utils.encryptPassword = (password, salt) => {
    if (!password) return "";
    try {

        const _password = crypto.pbkdf2Sync(
            password,
            salt,
            1000, 64,
            "sha512"
        ).toString("hex");
        return _password;
    } catch (error) {
        debug({ error });

        return "";
    }
},
utils.makeSalt=() =>{
    return crypto.randomBytes(16).toString("hex");
},
utils.comparePassword= (password, hashedPassword, salt) =>{
    return hashedPassword === utils.encryptPassword(password,salt);
}
module.exports=utils;