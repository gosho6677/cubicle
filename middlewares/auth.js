const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { COOKIE_NAME, TOKEN_SECRET } = require('../config/config.js');
const authServices = require('../services/authServices.js');

module.exports = () => (req, res, next) => {
    req.auth = {
        register,
        login,
        logout
    };

    if(readToken(req)) {
        next();
    }

    async function register({ username, password, repeatPassword }) {
        if (!username || !password || !repeatPassword) {
            throw new Error('All fields are required.');
        }
        if (password !== repeatPassword) {
            throw new Error('Passwords must match!');
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        const user = await authServices.createNewUser(username, hashedPassword);
        req.user = createToken(user);
    }

    async function login({ username, password }) {
        const user = await authServices.getUser(username);
        
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error('Wrong password!');
        }

        req.user = createToken(user);
    }

    async function logout() {
        res.clearCookie(COOKIE_NAME);
    }

    function createToken(user) {
        const userViewModel = {
            _id: user._id,
            username: user.username
        };
        const token = jwt.sign(userViewModel, TOKEN_SECRET);
        res.cookie(COOKIE_NAME, token, { httpOnly: true });

        return userViewModel;
    }

    function readToken(req) {
        let token = req.cookies[COOKIE_NAME];
        if (token) {
            try {
                // verify decodes, checks and returns user data
                let userData = jwt.verify(token, TOKEN_SECRET);
                req.user = userData;
                res.locals.user = userData;
            } catch (err) {
                res.clearCookie(COOKIE_NAME);
                res.redirect('/auth/login');
                return false;
            }
        }
        return true;
    }
};