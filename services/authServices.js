const User = require('../models/User.js');

async function createNewUser(username, password) {
    const user = new User({ username, password });
    await user.save();
    return user;
}

async function getUser(username) {
    const user = await User.findOne({ username: { $regex: username, $options: 'i' } });
    return user;
}

module.exports = {
    createNewUser,
    getUser
};