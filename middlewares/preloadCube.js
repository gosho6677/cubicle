const preloadCube = () => async (req, res, next) => {
    const id = req.params.id;
    try {
        const cube = await req.storage.getById(id);
        req.data = req.data || {};
        if(cube) {
            req.data.cube = cube;
        }
    } catch (err) {
        console.error(`DB Error: ${err.message}`);
    }
    next();
};

module.exports = preloadCube;