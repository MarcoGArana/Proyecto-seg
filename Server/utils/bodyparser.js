async function bodyParser(req, res) {
    const bool = await new Promise((resolve, reject) => {
        try {
            let totalData = "";
            req
                .on("data", chunk => {
                    totalData += chunk;
                })
                .on("end", () => {
                    try{
                        req.body = JSON.parse(totalData);
                        return resolve(true);
                    }catch{
                        res.writeHead(409, { "content-type": "application/json" });
                        res.write(JSON.stringify({ message: "Datos recibidos de forma incorrecta" }));
                        res.end();
                    }
                })
                .on('error', err => {
                    console.log(error);
                    res.writeHead(409, { "content-type": "application/json" });
                    res.write(JSON.stringify({ message: "Datos recibidos de forma incorrecta" }));
                    res.end();
                    return reject(false);
                })
        } catch(error) {
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "Datos recibidos de forma incorrecta" }));
            res.end();
            return reject(false);
        }
    })
    return bool
}

module.exports = { bodyParser };