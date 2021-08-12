const { isOwner, isAuthorized } = require('../middlewares/guards.js');
const preloadCube = require('../middlewares/preloadCube.js');

const router = require('express').Router();

router.get('/', async (req, res) => {
    let query = {
        search: req.query.search || '',
        from: req.query.from || '',
        to: req.query.to || ''
    };
    let cubes = await req.storage.getAll(query);
    res.render('catalog', { title: 'Browse cubes', cubes, query });
});

router.get('/create', isAuthorized(), (req, res) => {
    res.render('create', { title: 'Create page' });
});

router.post('/create', isAuthorized(), async (req, res) => {
    const cube = {
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        difficulty: Number(req.body.difficulty),
        author: req.user._id
    };

    try {
        await req.storage.create(cube);
    } catch (err) {
        if (err.name == 'ValidationError') {
            return res.render('create', { title: 'Create Cube', error: 'All fields are required. Image URL must be a valid URL.' });
        }
    }
    res.redirect('/');
});

router.get('/details/:id', preloadCube(), async (req, res) => {
    const cube = req.data.cube;
    // somehow cube.author and cube.authorId produces object and its not comparable with strict equal hence == or theres need to convert it from obj...
    cube.isOwner = req.user && (req.user._id == cube.authorId);
    res.render('details', { title: 'Cube Details', cube });
});

router.get('/edit/:id', preloadCube(), isOwner(), async (req, res) => {
    const cube = req.data.cube;
    cube[`selected${cube.difficulty}`] =  true;
    let ctx = {
        title: 'Edit Cube',
        cube
    };

    res.render('editCubePage', ctx);
});

router.post('/edit/:id', isOwner(), async (req, res) => {
    let id = req.params.id;
    const body = {
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        difficulty: Number(req.body.difficulty),
    };
    try {
        await req.storage.edit(body, id);
        res.redirect(`/cubes/details/${id}`);
    } catch(err) {
        res.redirect('/404');
    }
});

router.get('/delete/:id', preloadCube(), isOwner(), async (req, res) => {
    const cube = req.data.cube;
    res.render('deleteCubePage', { title: 'Delete Cube', cube});
});

router.post('/delete/:id', isOwner(), async (req, res) => {
    let id = req.params.id;
    await req.storage.del(id);
    res.redirect('/cubes');
});

router.get('/attach/:id', preloadCube(), async (req, res) => {
    try {
        const cube = req.data.cube;
        const cubeIds = (cube.accessories || []).map(a => a._id);
        const accessories = await req.storage.getAllAccessories(cubeIds);

        res.render('attachAccessory', { title: 'Attach accesories', cube, accessories });
    } catch(err) {
        console.error(err.message);
    }
});

router.post('/attach/:cubeId', async (req, res) => {
    const accessoryId = req.body.accessory;
    const cubeId = req.params.cubeId;

    await req.storage.attachAccessoryPost(accessoryId, cubeId);
    res.redirect(`/cubes/details/${cubeId}`);
});

module.exports = router;