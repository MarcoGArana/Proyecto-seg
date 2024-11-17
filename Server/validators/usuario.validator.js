const validators = {};
const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,32})/;
const emailRegexp = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
const telefonoRegex = /^[0-9]*$/;

validators.register = (req, res) => {
    const { nombre, correo, password, telefono } = req.body;
    if (nombre) {
        if (nombre == "") {
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "Es necesario un nombre" }));
            res.end();
            return false
        }
        if (nombre.length > 30 || nombre.length < 4) {
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "El nombre tiene que tener una longitud minima de 4 y maxima de 30 de caracteres" }));
            res.end();
            return false
        }
    } else {
        res.writeHead(409, { "content-type": "application/json" });
        res.write(JSON.stringify({ message: "Es necesario un nombre" }));
        res.end();
        return false
    }
    if (correo) {
        if (correo == "") {
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "Es necesario un correo" }));
            res.end();
            return false
        }
        if (!emailRegexp.test(correo)) {
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "El formato del correo es incorrecto" }));
            res.end();
            return false
        }
    } else {
        res.writeHead(409, { "content-type": "application/json" });
        res.write(JSON.stringify({ message: "Es necesario un correo" }));
        res.end();
        return false
    }

    if (password) {
        if (password == "") {
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "Es necesario una contrasena" }));
            res.end();
            return false
        }
        if (!passwordRegexp.test(password)) {
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "El formato de la contrasena es incorrecto" }));
            res.end();
            return false
        }
    } else {
        res.writeHead(409, { "content-type": "application/json" });
        res.write(JSON.stringify({ message: "Es necesario una contrasena" }));
        res.end();
        return false
    }
    if (telefono) {
        if (telefono == "") {
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "Es necesario un telefono" }));
            res.end();
            return false
        }
        if(!telefonoRegex.test(telefono)){
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "El formato del telefono es incorrecto" }));
            res.end();
            return false
        }
        if(telefono.length!=8){
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "El telefono tiene que tener una longitud de 8 caracteres" }));
            res.end();
            return
        }
    } else {
        res.writeHead(409, { "content-type": "application/json" });
        res.write(JSON.stringify({ message: "Es necesario un telefono" }));
        res.end();
        return false
    }
    return true;
}

module.exports = validators;