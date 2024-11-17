const mysql = require("mysql");
const { bodyParser } = require("../utils/bodyparser");
const validators = require("../validators/videojuego.validator")
require('dotenv').config();
const rol = require("../data/roles.constant.json")
const controller = {};
const con = mysql.createPool({
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD
});

controller.selectAll = async (req, res) => {
  try {

    const sql = "SELECT VIDEOJUEGO.id, VIDEOJUEGO.nombre, VIDEOJUEGO.descripcion, ESTADO.estado, VIDEOJUEGO.imagen, VIDEOJUEGO.precio,USUARIO.nombre AS 'usuario',USUARIO.correo,USUARIO.telefono, CATEGORIA.categoria FROM VIDEOJUEGO, USUARIO, ESTADO, CATEGORIA_VIDEOJUEGO, CATEGORIA WHERE VIDEOJUEGO.nombre_usuario = USUARIO.nombre AND ESTADO.id = VIDEOJUEGO.id_estado AND CATEGORIA_VIDEOJUEGO.id_categoria = CATEGORIA.id AND CATEGORIA_VIDEOJUEGO.id_videojuego = VIDEOJUEGO.id";
    con.query(sql, function (err, result) {
      if (err) throw err;
      res.writeHead(200, { "content-type": "application/json" });
      res.write(JSON.stringify(result));
      res.end();
    });
  } catch (error) {
    res.writeHead(500, { "content-type": "application/json" });
    res.write(JSON.stringify({ message: "Internal server error" }));
    res.end();
  }
}
controller.delete = async (req, res) => {
  try {
    const { url } = req;
    const id = url.split("?")[1].split("=")[1];
    if (!validators.idInParamsValidator(id, req, res)) {
      return
    }
    let sql;
    sql = "SELECT VIDEOJUEGO.id, VIDEOJUEGO.nombre, VIDEOJUEGO.descripcion, ESTADO.estado, VIDEOJUEGO.imagen, VIDEOJUEGO.precio,USUARIO.nombre AS 'usuario',USUARIO.correo,USUARIO.telefono, CATEGORIA.categoria FROM VIDEOJUEGO, USUARIO, ESTADO, CATEGORIA_VIDEOJUEGO, CATEGORIA WHERE VIDEOJUEGO.nombre_usuario = USUARIO.nombre AND ESTADO.id = VIDEOJUEGO.id_estado AND CATEGORIA_VIDEOJUEGO.id_categoria = CATEGORIA.id AND CATEGORIA_VIDEOJUEGO.id_videojuego = VIDEOJUEGO.id AND VIDEOJUEGO.id = " + mysql.escape(id);
    const _videogame = await new Promise((resolve, reject) => con.query(sql, function (err, result) {
      if (err) return reject(err);
      return resolve(result[0]);
    }));
    if ((rol.ADMIN == req.user.rol) || (rol.SYSADMIN == req.user.rol) || (req.user.nombre == _videogame.usuario)) {
      sql = "DELETE FROM categoria_videojuego WHERE id_videojuego=" + mysql.escape(id);
      con.query(sql, function (err, result) {
        if (err) {
          res.writeHead(409, { "content-type": "application/json" });
          res.write(JSON.stringify({ message: "Error deleting videogame" }));
          res.end();
        }
      });
      sql = "DELETE FROM VIDEOJUEGO WHERE id= " + mysql.escape(id);
      con.query(sql, function (err, result) {
        if (err) {
          res.writeHead(409, { "content-type": "application/json" });
          res.write(JSON.stringify({ message: "Error deleting videogame" }));
          res.end();
        } else {
          res.writeHead(200, { "content-type": "application/json" });
          res.write(JSON.stringify({ message: "Videogame deleted" }));
          res.end();
        }
      });
    } else {
      res.writeHead(409, { "content-type": "application/json" });
      res.write(JSON.stringify({ message: "Error deleting videogame" }));
      res.end();
    }
  } catch (error) {
    res.writeHead(500, { "content-type": "application/json" });
    res.write(JSON.stringify({ message: "Internal server error" }));
    res.end();
  }
}

controller.save = async (req, res) => {
  try {
    const { url } = req;
    if (!(await bodyParser(req, res))) {
      return
    }
    if (!validators.createVideogameValidator(req, res)) {
      return
    }
    if (url.split("=")[0] + "=" == "/videogame?id=") {
      const id = url.split("?")[1].split("=")[1];
      if (!validators.idInParamsValidator(id, req, res)) {
        return
      }
      let sql = "SELECT VIDEOJUEGO.id, VIDEOJUEGO.nombre, VIDEOJUEGO.descripcion, ESTADO.estado, VIDEOJUEGO.imagen, VIDEOJUEGO.precio,USUARIO.nombre AS 'usuario',USUARIO.correo,USUARIO.telefono, CATEGORIA.categoria FROM VIDEOJUEGO, USUARIO, ESTADO, CATEGORIA_VIDEOJUEGO, CATEGORIA WHERE VIDEOJUEGO.nombre_usuario = USUARIO.nombre AND ESTADO.id = VIDEOJUEGO.id_estado AND CATEGORIA_VIDEOJUEGO.id_categoria = CATEGORIA.id AND CATEGORIA_VIDEOJUEGO.id_videojuego = VIDEOJUEGO.id AND VIDEOJUEGO.id = " + mysql.escape(id);
      const _videogame = await new Promise((resolve, reject) => con.query(sql, function (err, result) {
        if (err) return reject(err);
        return resolve(result[0]);
      }));
      if (req.user.nombre == _videogame.usuario) {
        sql = "UPDATE videojuego, categoria_videojuego SET videojuego.descripcion=" + mysql.escape(req.body.descripcion) + ", videojuego.id_estado=" + mysql.escape(req.body.estado) + ", videojuego.imagen=" + mysql.escape(req.body.imagen) + ", videojuego.nombre=" + mysql.escape(req.body.nombre) + ", videojuego.precio=" + mysql.escape(req.body.precio) + ", categoria_videojuego.id_categoria=" + mysql.escape(req.body.categoria) + " WHERE videojuego.id=" + mysql.escape(id) + " AND categoria_videojuego.id_videojuego=" + mysql.escape(id);
        con.query(sql, function (err, result) {
          if (err) {
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "Error updating videogame" }));
            res.end();
            return
          } else {
            res.writeHead(200, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "Videogame updated" }));
            res.end();
            return
          }

        });
      } else {
        res.writeHead(409, { "content-type": "application/json" });
        res.write(JSON.stringify({ message: "Error updating videogame" }));
        res.end();
      }
    } else if (url == "/videogame/") {
      let sql = "";
      sql = "INSERT INTO VIDEOJUEGO(descripcion, id_estado, nombre, imagen, precio, nombre_usuario) VALUES  (" + mysql.escape(req.body.descripcion) + "," + mysql.escape(req.body.estado) + "," + mysql.escape(req.body.nombre) + "," + mysql.escape(req.body.imagen) + "," + mysql.escape(req.body.precio) + "," + mysql.escape(req.user.nombre) + ")";
      const _videogame = await new Promise((resolve, reject) => con.query(sql, function (err, result) {
        if (err) {
          return reject("");
        } else {
          return resolve(result);
        }
      }));

      if (!_videogame) {
        res.writeHead(409, { "content-type": "application/json" });
        res.write(JSON.stringify({ message: "Error creating videogame" }));
        res.end();
        return
      }
      sql = "INSERT INTO categoria_videojuego(id_categoria, id_videojuego) VALUES(" + mysql.escape(req.body.categoria) + "," + mysql.escape(_videogame.insertId) + ");";
      con.query(sql, function (err, result) {
        if (err) {
          res.writeHead(409, { "content-type": "application/json" });
          res.write(JSON.stringify({ message: "Error creating videogame" }));
          res.end();
          return
        } else {
          res.writeHead(200, { "content-type": "application/json" });
          res.write(JSON.stringify({ message: "Videogame created" }));
          res.end();
          return
        }
      });
    }
  } catch (error) {
    res.writeHead(500, { "content-type": "application/json" });
    res.write(JSON.stringify({ message: "Internal server error" }));
    res.end();
  }
}

module.exports = controller;