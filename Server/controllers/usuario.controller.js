const { createToken, verifyToken } = require("../utils/jwt.tools");
const crypto = require("../utils/crypto")
const Roles = require("../data/roles.constant.json");
const mysql = require("mysql");
const { bodyParser } = require("../utils/bodyparser");
require('dotenv').config();
const controller = {};
const con = mysql.createPool({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
});

controller.register = async (req, res) => {
    try {
        await bodyParser(req);
        const { nombre, correo, password, telefono } = req.body;
        let user;
        let sql = "SELECT * FROM USUARIO WHERE nombre = " + mysql.escape(nombre) + "OR correo =" + mysql.escape(correo);
        user = await new Promise((resolve, reject) => con.query(sql, function (err, result) {
            if (err) return reject(err);
            return resolve(result[0]);

        }))
        if (user) {
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "User already exists" }));
            res.end();
            return
        }
        const salt = crypto.makeSalt();
        const hashedPassword = crypto.encryptPassword(password, salt);

        sql = "INSERT INTO USUARIO(nombre, correo,telefono,contrasena,salt,rol) VALUES(" + mysql.escape(nombre) + "," + mysql.escape(correo) + "," + mysql.escape(telefono) + "," + mysql.escape(hashedPassword) + "," + mysql.escape(salt) + ",1)";
        con.query(sql, function (err, result) {
            if (err) throw err;
            res.writeHead(200, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "El usuario ha sido creado con exito" }));
            res.end();
        });
    } catch (error) {
        res.writeHead(500, { "content-type": "application/json" });
        res.write(JSON.stringify({ error: "Internal Server Error" }));
        res.end();

    }
}

controller.login = async (req, res) => {
    try {
        // identificador: usuario o correo
        await bodyParser(req);
        const { identifier, password } = req.body;

        let user;
        let sql = "SELECT * FROM USUARIO WHERE nombre = " + mysql.escape(identifier) + "OR correo =" + mysql.escape(identifier);
        user = await new Promise((resolve, reject) => con.query(sql, function (err, result) {
            if (err) return reject(err);

            return resolve(result[0]);
        }))
        if (!user) {
            res.writeHead(404, { "content-type": "application/json" });
            res.write(JSON.stringify({ error: "El usuario no existe" }));
            res.end();
            return
        }
        if (!crypto.comparePassword(password, user.contrasena, user.salt)) {
            res.writeHead(401, { "content-type": "application/json" });
            res.write(JSON.stringify({ error: "El password no existe" }));
            res.end();
            return
        }



        const token = await createToken(user.nombre);

        sql = "SELECT * FROM TOKEN WHERE nombre_usuario = " + mysql.escape(user.nombre);
        let _token;
        _token = await new Promise((resolve, reject) => con.query(sql, function (err, result) {
            if (err) return reject(err);
            return resolve(result);
        }));
        if (_token.length == 5) {
            sql = "DELETE FROM TOKEN WHERE id= " + mysql.escape(_token[0].id);
            con.query(sql, function (err, result) {
                if (err) throw err;
            });
        }
        sql = "INSERT INTO TOKEN(token,nombre_usuario) VALUES(+" + mysql.escape(token) + "," + mysql.escape(user.nombre) + ");";
        con.query(sql, function (err, result) {
            if (err) throw err;
            res.writeHead(200, { "content-type": "application/json" });
            res.write(JSON.stringify({ token }));
            res.end();
        });



    } catch (error) {
        res.writeHead(500, { "content-type": "application/json" });
        res.write(JSON.stringify({ error: "Internal Server Error" }));
        res.end();
    }
}

controller.whoAmI = async (req, res) => {
    try {

        const { nombre, correo, telefono, rol } = req.user;
        res.writeHead(200, { "content-type": "application/json" });
        res.write(JSON.stringify({ nombre, correo, telefono, rol }));
        res.end();
        return

    } catch (error) {
        res.writeHead(500, { "content-type": "application/json" });
        res.write(JSON.stringify({ error: "Internal Server Error" }));
        res.end();

    }
}

controller.toogleRol = async (req, res) => {
    try {
        await bodyParser(req);
        let sql = "SELECT * FROM USUARIO WHERE nombre = " + mysql.escape(req.body.nombre);
        const user = await new Promise((resolve, reject) => con.query(sql, function (err, result) {
            if (err) return reject(err);
            return resolve(result[0]);

        }))
        
        if (!user) {
            res.writeHead(404, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "User does not exists" }));
            res.end();
            return
        }
        let rol;
        if (user.rol == 1) {
        rol=2;
        } else if (user.rol == 2) {
        rol=1;
        }
        sql = "UPDATE USUARIO SET rol ="+mysql.escape(rol)+" WHERE nombre = " + mysql.escape(req.body.nombre);
        con.query(sql, function (err, result) {
            if (err) {
                res.writeHead(409, { "content-type": "application/json" });
                res.write(JSON.stringify({ message: "Error updating rol" }));
                res.end();
                return
            } else {
                res.writeHead(200, { "content-type": "application/json" });
                res.write(JSON.stringify({ message: "Rol updated" }));
                res.end();
                return
            }

        })



    } catch (error) {
        res.writeHead(500, { "content-type": "application/json" });
        res.write(JSON.stringify({ error: "Internal Server Error" }));
        res.end();

    }
}
module.exports = controller;