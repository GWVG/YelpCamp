const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mbToken = process.env.MAPBOX_publicToken;
const geocoder = mbxGeocoding({ accessToken: mbToken });
const { cloudinary } = require('../cloudinary');

module.exports.index = catchAsync(async (req, res) =>
{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});

module.exports.newForm = (req, res) =>
{
    res.render('campgrounds/new');
};

module.exports.create = catchAsync(async (req, res) =>
{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    const d = new Date(Date.now());
    campground.date = d.toLocaleDateString('en-GB');
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully created new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
});

module.exports.show = catchAsync(async (req, res, next) =>
{
    const campground = await Campground.findById(req.params.id).populate(
        {
            path: 'reviews',
            populate: 'author'
        }
    ).populate('author');
    if (campground)
    {
        res.render('campgrounds/show', { campground });
    } else
    {
        req.flash('error', 'Campground cannot be found.');
        return res.redirect(`/campgrounds`);
    }
});

module.exports.editForm = catchAsync(async (req, res) =>
{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
});

module.exports.update = catchAsync(async (req, res) =>
{
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    if (req.body.deleteImages)
    {
        for (let filename of req.body.deleteImages)
        {
            cloudinary.uploader.destroy(filename);
        }
        console.log(req.body.deleteImages);
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });

    };
    await campground.save();
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
});

module.exports.delete = catchAsync(async (req, res) =>
{
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect(`/campgrounds`);
});