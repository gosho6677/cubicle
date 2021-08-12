const { isGuest, isAuthorized } = require('../middlewares/guards.js');
const router = require('express').Router();

router.get('/register', isGuest(), (req, res) => {
    res.render('registerPage', { title: 'Register' });
});

router.post('/register', isGuest(), async (req, res) => {
    try {
        await req.auth.register(req.body);
        res.redirect('/cubes');
    } catch (err) {
        let ctx = {
            title: 'Register',
            error: err.message,
            data: { username: req.body.username }
        };
        res.render('registerPage', ctx);
    }
});

router.get('/login', isGuest(), (req, res) => {
    res.render('loginPage', { title: 'Login' });
});

router.post('/login', isGuest(), async (req, res) => {
    try {
        await req.auth.login(req.body);
        res.redirect('/cubes');
    } catch (err) {
        console.error(err);
        let ctx = {
            title: 'Login',
            error: err.message,
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
