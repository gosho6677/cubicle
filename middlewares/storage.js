const cubeServices = require('../services/cubeServices.js');
const accessoryServices = require('../services/accessoryServices.js');

async function init() {
    return (req, res, next) => {
        const storage = Object.assign({}, cubeServices, accessoryServices);
        req.storage = storage;
        next();
    };
}

module.exports = init;