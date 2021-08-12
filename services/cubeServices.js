const Accessory = require('../models/Accessory.js');
const Cube = require('../models/Cube.js');

async function create(cube) {
    let newCube = new Cube(cube);
    return newCube.save();
}

async function edit(body, id) {
    let inDB = await Cube.findById(id);

    if(!inDB) {
        throw new Error('ID does not exist in the database.');
    }

    Object.assign(inDB, body);
    return inDB.save();
}

async function del(id) {
    await Cube.findByIdAndDelete(id);
}

async function getAll(query) {
    let options = {};

    if(query.search) {
        options.name = { $regex: query.search, $options: 'i' };
    };

    if(query.from) {
        options.difficulty = { $gte: query.from };
    }

    if(query.to) {
        options.difficulty 
            ? options.difficulty.$lte = query.to
            : options.difficulty = { $lte: query.to }; 
    }

    const cubes = Cube.find(options).lean();
    return cubes;
}

async function getById(id) {
    let cube = await Cube
        .findById(id)
        .populate('accessories')
        .populate('author')
        .lean();
    
    if(!cube) {
        return undefined;
    }
    
    const viewModel = {
        _id: cube._id,
        name: cube.name,
        description: cube.description,
        imageUrl: cube.imageUrl,
        difficulty: cube.difficulty,
        accessories: cube.accessories,
        author: cube.author && cube.author.username,
        authorId: cube.author && cube.author._id
    };
    return viewModel;
}

async function attachAccessoryPost(accessoryId, cubeId) {
    let cube = await Cube.findById(cubeId);
    let accessory = await Accessory.findById(accessoryId);

    if (!cube || !accessory) {
        throw new Error('No such ID in database');
    }

    cube.accessories.push(accessory);
    return cube.save();
}

module.exports = {
    create,
    edit,
    getAll,
    getById,
    attachAccessoryPost,
    del,
};