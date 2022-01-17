const express = require('express');
const { validate } = require('uuid');
const fs = require('fs');

module.exports = (config, path) => {

    const router = express.Router();

    router.get('/:type/:id', async (req, res) => {
        if (!req.params.type || !req.params.id) {
            return res.sendFile('index.html');
        }

        const type = req.params.type.toLowerCase();
        const id = req.params.id;

        if (!validate(id)) {
            return res.status(409).send({
                error: 'Please provide an valid id.'
            });
        }

        const filePath = `${config.dataFolder}/${type}/${id}.${type}`;

        if (!fs.existsSync(path.resolve(`${__dirname}/../public/${filePath}`))) {
            return res.status(404).send({
                error: 'Image not found.'
            });
        }

        res.send(toHTML(`${config.url}`, filePath));
    });

    function toHTML(url, path) {
        const imagePath = `${url}/${path}`;
        return `
            <!doctype html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport"
                          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
                    <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    
                    <title>${config.applicationName}</title>
                    <link rel="shortcut icon" href="${url}/src/img/favicon.ico" type="image/x-icon">
                    
                    <!--  Metadata | Start -->
                    <meta name="twitter:card" content="summary_large_image"/>
                    <meta property="og:title" content="${config.applicationName}"/>
                    <meta property="og:description" content="${config.applicationDescription}"/>
                    <meta property="og:url" content="${url}"/>
                    <meta property="og:image" content="${imagePath}" />
                    <meta property="title" content="${config.applicationName}"/>
                    <meta property="description" content="${config.applicationDescription}"/>
                    <meta property="url" content="${url}"/>
                    <meta property="image" content="${imagePath}" />
                    <meta name="theme-color" content="${config.applicationColor}">
                    <!--  Metadata | End -->
                   
                    <!-- Stylesheets | Start -->
                    <link rel="stylesheet" href="${url}/src/css/style.css" >          
                    <!-- Stylesheets | End -->
                </head>
                <body>
                    <div class="content">
                        <img src="${imagePath}" alt="">
                    </div>
                </body>
            </html>            
        `
    }

    return router;
}