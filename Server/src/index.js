const http = require("http");
const videojuego = require("../controllers/videojuego.controller");
const user = require("../controllers/usuario.controller")
const auth = require("../middlewares/auth.middleware")
const rol = require("../data/roles.constant.json")
require('dotenv').config();

const server = http.createServer(async (req, res) => {
    const { url, method } = req;


    switch (method) {
        case "GET":
            if (url == "/videogame/") {
                if(await auth.authentication(req,res)){
                if(auth.authorization(req,res,rol.USER,rol.ADMIN)){
                videojuego.selectAll(req, res);
                }
                }
            } else if (url == "/login/") {
                user.login(req, res);
            } else if (url == "/whoami/") {
                if(await auth.authentication(req, res)){
                user.whoAmI(req, res);
                }
            }

            break;
        case "POST":
            if (url == "/register/") {
                user.register(req, res);
            } else if (url.includes("/videogame")) {
                if(await auth.authentication(req, res)){
                if(auth.authorization(req,res,rol.USER,rol.ADMIN)){
                videojuego.save(req, res);
                }
                }
            }

            break;
        case "PUT":
            if (url == "/rol/") {
                if(await auth.authentication(req,res)){
                if(auth.authorization(req,res)){
                user.toogleRol(req, res);
                }
            }
            }
            break;
        case "DELETE":
            if (url.split("=")[0] + "=" == "/videogame?id=") {
                if(await auth.authentication(req,res)){
                if(auth.authorization(req,res,rol.USER,rol.ADMIN)){
                videojuego.delete(req, res);
            }
        }
        }

            break;

        default:
            break;
    }

})

server.listen(process.env.PORT);