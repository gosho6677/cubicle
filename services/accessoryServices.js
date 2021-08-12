const Accessory = require('../models/Accessory.js');

async function createAccessory(body) {
    let accessory = new Accessory(body);
    return accessory.save();
}

async function getAllAccessories(alreadyUsed) {
    return Accessory.find({ _id: { $nin: alreadyUsed } }).lean();
}

module.exports = {
    createAccessory,
    getAllAccessories,
};