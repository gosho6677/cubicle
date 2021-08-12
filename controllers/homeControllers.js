const router = require('express').Router();

router.get('/', (req, res) => res.redirect('/cubes'));

router.get('/about', (req, res) => {
    res.render('about', { title: 'About page' });
});

router.all('*', (req, res) => {
    res.render('404', {title: 'Page Not Found'});
});

module.exports = router;
