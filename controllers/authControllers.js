const { isGuest, isAuthorized } = require('../middlewares/guards.js');
const { body, validationResult } = require('express-validator');
const { getUser } = require('../services/authServices.js');
const router = require('express').Router();

router.get('/register', isGuest(), (req, res) => {
    res.render('registerPage', { title: 'Register' });
});

router.post('/register',
    isGuest(),
    body('username', 'Username must be atleast 5 characters long.').isLength({ min: 5 }).isAlphanumeric().custom(async val => {
        const user = await getUser(val);
        if (user) {
            throw new Error('Username already exists!');
        }
        return true;
    }),
    body('password', 'Password must be atleast 8 characters long.').isLength({ min: 8 }).isAlphanumeric(),
    body('repeatPassword').custom((val, { req }) => {
        if (val !== req.body.password) {
            throw new Error('Passwords must match!');
        }
        return true;
    }),
    async (req, res) => {
        const errorsObj = validationResult(req).mapped();
        let errors = Object.values(errorsObj);

        try {
            if (errors.length) {
                errors = errors.map(e => e.msg).join('&');
                throw new Error(errors);
            }

            await req.auth.register(req.body);
            res.redirect('/cubes');
        } catch (err) {
            let ctx = {
                title: 'Register',
                errors: err.message.split('&'),
                data: { username: req.body.username }
            };
            res.render('registerPage', ctx);
        }
    });

router.get('/login', isGuest(), (req, res) => {
    res.render('loginPage', { title: 'Login' });
});

router.post('/login',
    isGuest(),
    body('username', 'Username must be atleast 5 characters long.').isLength({ min: 5 }).isAlphanumeric().custom(async val => {
        const user = await getUser(val);
        if(!user) {
            throw new Error('Username does not exist!');
        }
        return true;
    }),
    body('password', 'Password must be atleast 8 characters long.').isLength({ min: 8 }).isAlphanumeric(),
    async (req, res) => {
        const errorsObj = validationResult(req).mapped();
        let errors = Object.values(errorsObj);

        try {
            if (errors.length) {
                errors = errors.map(e => e.msg).join('&');
                throw new Error(errors);
            }

            await req.auth.login(req.body);
            res.redirect('/cubes');
        } catch (err) {
            let ctx = {
                title: 'Login',
                errors: err.message.split('&'),
                data: { username: req.body.username }
            };
            res.render('loginPage', ctx);
        }
    });

router.get('/logout', isAuthorized(), async (req, res) => {
    await req.auth.logout();
    res.redirect('/cubes');
});

module.exports = router;
