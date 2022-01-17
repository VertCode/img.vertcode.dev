const express = require('express');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const app = express();
const port = process.env.PORT || 5005;
const dev = process.platform === 'win32';
const config = require(`${__dirname}/config.json`);
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
app.use(fileUpload({
    createParentPath: true
}));

fs.readdirSync(__dirname + '/routes').forEach(file => {
    app.use(require(__dirname + '/routes/' + file)(config, path));
})

app.listen(port, () => {
    console.log(`Started img.vertcode.dev on port ${port}`);
    console.log(`Website: ${dev ? `http://localhost:${port}` : 'https://img.vertcode.dev'}`);
});