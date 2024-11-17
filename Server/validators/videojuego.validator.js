const validators = {};
const base64regex = /^data:image\/(jpeg|png|jpg);base64,([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
const idRegex = /^[0-9]*$/;
validators.idInParamsValidator = (id,req,res) => {
    if (id) {
        if (id=="") {
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "Es necesario un id" }));
            res.end();
            return false
        }
        if (id=="0") {
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "El id no pude ser 0" }));
            res.end();
            return false
        }
        if (!idRegex.test(id)) {
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "El id tiene que ser una cadena de numeros" }));
            res.end();
            return false
        }
    } else {
        res.writeHead(409, { "content-type": "application/json" });
        res.write(JSON.stringify({ message: "Es necesario un id" }));
        res.end();
        return false
    }
    return true
}

validators.createVideogameValidator = (req, res) => {
    const { descripcion, imagen, precio, estado, categoria, nombre } = req.body;
    if (estado) {
        if (!Number.isInteger(estado)) {
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "El estado tiene que ser un numero entero" }));
            res.end();
            return false
        }
        if (estado <= 0) {
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "El estado tiene que ser un numero positivo" }));
            res.end();
            return false
        }
    } else {
        res.writeHead(409, { "content-type": "application/json" });
        res.write(JSON.stringify({ message: "Es necesario el id del estado" }));
        res.end();
        return false
    }

    if (categoria) {
        if (!Number.isInteger(categoria)) {
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "La categoria tiene que ser un numero entero" }));
            res.end();
            return false
        }
        if (categoria <= 0) {
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "La categoria tiene que ser un numero positivo" }));
            res.end();
            return false
        }
    } else {
        res.writeHead(409, { "content-type": "application/json" });
        res.write(JSON.stringify({ message: "Es necesario el id de la categoria" }));
        res.end();
        return false
    }

    if (precio) {
        if (typeof precio != "number") {
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "El precio tiene que ser un numero" }));
            res.end();
            return false
        }
        if (precio <= 0) {
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "El precio tiene que ser un numero positivo" }));
            res.end();
            return false
        }
    } else {
        res.writeHead(409, { "content-type": "application/json" });
        res.write(JSON.stringify({ message: "Es necesario el precio" }));
        res.end();
        return false
    }

    if(nombre){
        if (nombre == "") {
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "Es necesario un nombre" }));
            res.end();
            return false
        }
        if(nombre.length>40){
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "El nombre tiene que tener una longitud menor a 40 caracteres" }));
            res.end();
            return false
        }
    }else{
        res.writeHead(409, { "content-type": "application/json" });
        res.write(JSON.stringify({ message: "Es necesario un nombre" }));
        res.end();
        return false
    }

    if(descripcion){
        if (descripcion == "") {
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "Es necesario una descripcion" }));
            res.end();
            return false
        }
        if(descripcion.length>700){
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "La descripcion tiene que tener una longitud menor a 700 caracteres" }));
            res.end();
            return false
        }
    }else{
        res.writeHead(409, { "content-type": "application/json" });
        res.write(JSON.stringify({ message: "Es necesario una descripcion" }));
        res.end();
        return false
    }

    if(imagen){
        if (imagen == "") {
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "Es necesario una imagen" }));
            res.end();
            return false
        }
        if(!base64regex.test(imagen)){
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "La imagen tiene que estar en base 64" }));
            res.end();
            return false
        }
    }else{
        res.writeHead(409, { "content-type": "application/json" });
        res.write(JSON.stringify({ message: "Es necesario una imagen" }));
        res.end();
        return false
    }
    return true
}

module.exports = validators;