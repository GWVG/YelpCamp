const express = require('express');
const router = express.Router();
const { isLoggedIn, isAuthor, campgroundValidation, findCampground } = require('../middleware');
const campground = require('../controllers/campground');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(campground.index)
    .post(
        isLoggedIn,
        upload.array('images'),
        campgroundValidation,
        campground.create
    );

router.get('/new', isLoggedIn, campground.newForm);

router.route('/:id')
    .get(findCampground, campground.show)
    .put(
        findCampground,
        isLoggedIn,
        isAuthor,
        upload.array('images'),
        campgroundValidation,
        campground.update
    )
    .delete(findCampground, isLoggedIn, isAuthor, campground.delete);

router.get('/:id/edit', findCampground, isLoggedIn, isAuthor, campground.editForm);

module.exports = router;