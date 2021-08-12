const homeControllers = require('../controllers/homeControllers.js');
const accessoryControllers = require('../controllers/accessoryControllers.js');
const cubeControllers = require('../controllers/cubeControllers.js');
const authControllers = require('../controllers/authControllers.js');

module.exports = (app) => {
    app.use('/cubes', cubeControllers);
    app.use('/accessory', accessoryControllers);
    app.use('/auth', authControllers);
    app.use('/', homeControllers);
};