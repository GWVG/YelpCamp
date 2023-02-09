const Campground = require('./models/campground');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ObjectID = require('mongoose').Types.ObjectId;


module.exports.isLoggedIn = (req, res, next) =>
{
    if (!req.isAuthenticated())
    {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in.');
        return res.redirect('/login');
    }
    next();
};

module.exports.isAuthor = async (req, res, next) =>
{
    const campground = await Campground.findById(req.params.id);
    if (!campground.author.equals(res.locals.currentUser._id))
    {
        req.flash('error', 'You are not authorized.');
        return res.redirect(`/campgrounds`);
    }
    next();
};

module.exports.campgroundValidation = (req, res, next) =>
{
    const { error } = campgroundSchema.validate(req.body);
    if (error)
    {
        console.log(error);
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 404);
    }
    else { next(); }
};

module.exports.reviewValidation = (req, res, next) =>
{
    const { error } = reviewSchema.validate(req.body);
    if (!req.body.review.body)
    {
        req.flash('error', 'Review text cannot be empty');
        return res.redirect(`/campgrounds/${req.params.id}`);
    };
    if (error)
    {
        console.log(error);
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 404);
    }
    next();
};

module.exports.findCampground = async (req, res, next) =>
{
    if (!ObjectID.isValid(req.params.id))
    {
        req.flash('error', 'Invalid ObjectID! Campground cannot be found.');
        return res.redirect(`/campgrounds`);
    };
    const campground = await Campground.findById(req.params.id);
    if (!campground)
    {
        req.flash('error', 'Campground cannot be found.');
        return res.redirect(`/campgrounds`);
    };
    next();
};
