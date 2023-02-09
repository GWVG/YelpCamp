const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

module.exports.registerForm = (req, res) =>
{
    res.render('user/register');
};

module.exports.create = catchAsync(async (req, res) =>
{
    try
    {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        req.login(newUser, err =>
        {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp');
            res.redirect(`/campgrounds`);
        });
    } catch (e)
    {
        req.flash('error', e.message);
        res.redirect(`/register`);
    }
});

module.exports.loginForm = (req, res) =>
{
    res.render('user/login');
};

module.exports.login = (req, res) =>
{
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) =>
{
    req.logout(function (err)
    {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/campgrounds');
    });
};