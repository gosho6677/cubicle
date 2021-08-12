const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('createAccessory', { title: 'Create accessory' });
});

router.post('/create', async (req, res) => {
    const accessory = {
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl
    };
    try {
        await req.storage.createAccessory(accessory);
        res.redirect('/');
    } catch (err) {
        return res.render('createAccessory', { error: err.message });
    }
});

module.exports = router;

