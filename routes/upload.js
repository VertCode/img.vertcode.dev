const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

module.exports = (config, path) => {
    const router = express.Router();

    router.post('/upload', async (req, res) => {
        const file = req.files.image;
        const token = req.headers.token;

        if (!token || !config.tokens.includes(token)) {
            return res.status(401).send({
                error: 'Token not found or is invalid.'
            });
        }

        if (!file || !file.mimetype || file.mimetype.split('/')[0] !== 'image') {
            return res.status(409).send({
                error: 'You must upload an image.'
            });
        }

        const fileName = uuidv4();
        const type = file.mimetype.split('/')[1];
        const folder = path.resolve(`${__dirname}/../public/${config.dataFolder}/${type}`);

        if (!fs.existsSync(folder)){
            fs.mkdirSync(folder, { recursive: true });
        }

        const imagePath = path.resolve(`${folder}/${fileName}.${type}`);

        file.mv(imagePath, (error) => {
            if (error) {
                return res.status(500).send({
                    error: "An error occurred while uploading your image.",
                    errorMessage: error.message
                });
            }

            res.send(`${config.url}/${type}/${fileName}`);
        });
    })

    return router;
}