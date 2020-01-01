const express = require('express');
const multer = require('multer');
const upload = multer({
    dest: './uploads'
}).array('fotos', 2);
// opcional 
const fs = require('fs');

const app = express();

app.get('/', (req, res) => {
    res.send(`
        <form action='/subir-archivo' method='post' enctype='multipart/form-data'>
            Nombre: <input type='text' name='nombre' /><br />
            Fotos: <input type='file' name='fotos' multiple /><br />
            <button type='submit'>Guardar</button><br />
        </form>
    `);
});

app.post('/subir-archivo', (req, res, next) => {
        upload(req, res, (err) => {
            let error = false;
            if(err instanceof multer.MulterError) {
                console.error(err.code, err.name, err.message);
                error = true;
            } else if(err) {
                console.error(err);
                error = true;
            }
            if(error) {
                res.status(500).send("Ocurrió un error al subir los archivos");
            } else {
                console.log(req.files);
                console.log(req.body);
                req.files.forEach((f) => {
                    const rutaActual = f.path;
                    const nuevoNombre = f.destination + '/' + f.originalname;
                    renombrarArchivo( rutaActual, nuevoNombre );
                });
                res.send('El archivo subió correctamente.');
            }
        });
    }
);

const port = 8080 || process.env.PORT;
app.listen(port, () => console.log(`listening on port ${port}`));


function renombrarArchivo( rutaActual, nuevoNombre) {
    fs.rename(rutaActual, nuevoNombre, (err) => {if(err)console.error(err)} );
}