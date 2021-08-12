const router = require('express').Router();
const { body, validationResult } = require('express-validator');

router.get('/', (req, res) => {
    res.render('createAccessory', { title: 'Create accessory' });
});

router.post('/create',
    body('name', 'Name must be atleast 5 characters long.').isLength({ min: 5 }).isAlphanumeric(),
    body('description', 'Description must be atleast 20 characters long.').isLength({ min: 20 }).isAlphanumeric(),
    body('imageUrl', 'Image field must be a valid URL.').isURL(),
    async (req, res) => {
        const errorsObj = validationResult(req).mapped();
        let errors = Object.values(errorsObj);

        const accessory = {
            name: req.body.name,
            description: req.body.description,
            imageUrl: req.body.imageUrl
        };

        try {
            if (errors.length) {
                errors = errors.map(e => e.msg).join('&');
                throw new Error(errors);
            }

            
            await req.storage.createAccessory(accessory);
            res.redirect('/');
        } catch (err) {
            return res.render('createAccessory', { title:'Create accesory', errors: err.message.split('&'), accessory });
        }
    });

module.exports = router;

