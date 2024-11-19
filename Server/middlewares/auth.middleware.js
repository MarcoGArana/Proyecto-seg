const { verifyToken } = require("../utils/jwt.tools")
const Roles = require("../data/roles.constant.json");
const mysql = require("mysql");
require('dotenv').config();
const con = mysql.createPool({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
});

const middlewares = {};
const PREFIX = "Bearer";

middlewares.authentication = async (req, res) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            res.writeHead(401, { "content-type": "application/json" });
            res.write(JSON.stringify({ error: "El usuario no esta autenticado" }));
            res.end();
            return false
        }

        const [prefix, token] = authorization.split(" ");
        
        if (prefix !== PREFIX) {
            res.writeHead(401, { "content-type": "application/json" });
            res.write(JSON.stringify({ error: "El usuario no esta autenticado" }));
            res.end();
            return false
        }
        
        if (!token) {
            res.writeHead(401, { "content-type": "application/json" });
            res.write(JSON.stringify({ error: "El usuario no esta autenticado" }));
            res.end();
            return false
        }

        const payload = await verifyToken(token);
        if (!payload) {
            res.writeHead(401, { "content-type": "application/json" });
            res.write(JSON.stringify({ error: "El usuario no esta autenticado" }));
            res.end();
            return false
        }
        const userName = payload.sub;
        let user;
        let sql = "SELECT USUARIO.contrasena, USUARIO.correo,USUARIO.nombre,USUARIO.telefono, ROL.rol FROM USUARIO, ROL where USUARIO.rol=ROL.id AND USUARIO.nombre= " + mysql.escape(userName);
        user = await new Promise((resolve,reject)=>con.query(sql, function (err, result) {
            if (err) return reject(err);
            return resolve(result[0]);
        }));


        if (!user) {
            res.writeHead(401, { "content-type": "application/json" });
            res.write(JSON.stringify({ error: "El usuario no esta autenticado" }));
            res.end();
            return false
        }

        sql = "SELECT * FROM TOKEN WHERE token = " + mysql.escape(token);
        let _token;
        _token = await new Promise((resolve,reject)=>con.query(sql, function (err, result) {
            if (err) return reject(err);
            return resolve(result);
        }));
        
        if (!_token) {
            res.writeHead(401, { "content-type": "application/json" });
            res.write(JSON.stringify({ error: "El usuario no esta autenticado" }));
            res.end();
            return false
        }
        req.user = user;
        req.token = token;
        return true
    } catch (error) {
        console.error(error);
        res.writeHead(500, { "content-type": "application/json" });
        res.write(JSON.stringify({ error: "Internal server error" }));
        res.end();
        return false
    }
}

middlewares.authorization = (req,res,roleRequired = Roles.SYSADMIN, roleRequired2=Roles.SYSADMIN) => {
        try {
            const { rol } = req.user;

            const isAuth = ((rol == roleRequired) || (rol==roleRequired2));
            const isSysAdmin = rol == Roles.SYSADMIN;
            if (!isAuth && !isSysAdmin) {
                res.writeHead(403, { "content-type": "application/json" });
                res.write(JSON.stringify({ error: "Prohibido el acceso" }));
                res.end();
                return false
            }
            return true

        } catch (error) {
            console.error(error);
            res.writeHead(500, { "content-type": "application/json" });
            res.write(JSON.stringify({ error: "Internal server error" }));
            res.end();
            return false
        }
    }


module.exports = middlewares;