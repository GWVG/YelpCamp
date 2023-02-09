const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.create = catchAsync(async (req, res) =>
{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    const d = new Date(Date.now());
    review.date = d.toLocaleDateString('en-GB');
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Succesfully submitted review!');
    res.redirect(`/campgrounds/${campground._id}`);
});

module.exports.delete = catchAsync(async (req, res) =>
{
    const { id, reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currentUser._id))
    {
        req.flash('error', 'You are not authorized.');
        return res.redirect(`/campgrounds/${id}`);
    }

    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Succesfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
});