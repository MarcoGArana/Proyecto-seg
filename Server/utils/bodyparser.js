async function bodyParser(req, res) {
    return await new Promise((resolve, reject) => {
        try {
            let totalData = "";
            req
                .on("data", chunk => {
                    totalData += chunk;
                })
                .on("end", () => {
                    req.body = JSON.parse(totalData);
                    return resolve(true);
                })
                .on('error', err => {
                    console.log(error);
                    res.writeHead(409, { "content-type": "application/json" });
                    res.write(JSON.stringify({ message: "Datos recibidos de forma incorrecta" }));
                    res.end();
                    return reject(false);
                })
        } catch {
            res.writeHead(409, { "content-type": "application/json" });
            res.write(JSON.stringify({ message: "Datos recibidos de forma incorrecta" }));
            res.end();
            return reject(false);
        }
    })
}

module.exports = { bodyParser };