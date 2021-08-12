const isAuthorized = () => (req, res, next) => {
    if(req.user) {
        next();
    } else {
        res.redirect('/auth/login');
    }
};

const isGuest = () => (req, res, next) => {
    if(!req.user) {
        next();
    } else {
        res.redirect('/cubes');
    }
};

const isOwner = () => (req, res, next) => {
    if(req.user && req.data.cube && (req.user._id == req.data.cube.authorId)) {
        next();
    } else {
        res.redirect('/auth/login');
    }
};

module.exports = {
    isAuthorized,
    isGuest,
    isOwner,
};