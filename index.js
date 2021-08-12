const env = process.env.NODE_ENV || 'development';

const config = require('./config/config')[env];
const app = require('express')();
const services = require('./middlewares/storage.js');

start();

async function start() {
    require('./config/express')(app);
    await require('./config/database.js')(app);

    app.use(await services());
    require('./config/routes')(app);
}

app.listen(config.port, console.log(`Listening on port ${config.port}.`));