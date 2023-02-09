const express = require('express');
const router = express.Router({ mergeParams: true });
const { isLoggedIn, reviewValidation } = require('../middleware');
const review = require('../controllers/review');

router.post('/', isLoggedIn, reviewValidation, review.create);

router.delete('/:reviewId', isLoggedIn, review.delete);

module.exports = router;