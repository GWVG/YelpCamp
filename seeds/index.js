const mongoose = require('mongoose');
const Campground = require('../models/campground');
const Review = require('../models/review');
const User = require('../models/user');
const cities = require('./cities');
const { places, descriptors, descriptions, firstNames, lastNames, revs } = require('./seedHelper');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () =>
{
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () =>
{
    await Campground.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});

    const gertwillem = new User({
        email: `gert.vg@hotmail.com`,
        username: `Gert-Willem`
    });
    const admin = await User.register(gertwillem, 'admin');

    for (let i = 0; i < 100; i++)
    {
        const d = new Date(Date.now());
        const date = d.toLocaleDateString('en-GB');

        const rand1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const c = new Campground(
            {
                title: `${sample(descriptors)} ${sample(places)}`,
                location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
                images: [{
                    url: "https://source.unsplash.com/random/300x300?campground",
                    filename: `${cities[rand1000].city}, ${cities[rand1000].state}`
                }],
                geometry: {
                    type: "Point",
                    coordinates: [cities[rand1000].longitude, cities[rand1000].latitude]
                },
                price,
                description: `${sample(descriptions)}`,
                date,
                author: admin
            }
        );

        const amountReviews = Math.floor(Math.random() * 1) + 1;
        for (let e = 0; e < amountReviews; e++)
        {
            const user = new User({
                email: `${sample(firstNames).toLowerCase()}.${sample(lastNames).toLowerCase()}${i}${e}@hotmail.com`,
                username: `${sample(firstNames)} ${sample(firstNames)} ${sample(lastNames)}`
            });
            const author = await User.register(user, user.username);

            const review = new Review({
                body: `${sample(revs)}`,
                rating: Math.floor(Math.random() * 3) + 3,
                date,
                author
            });
            await review.save();
            c.reviews.push(review);
        }

        await c.save();
    }
};

seedDB().then(() => mongoose.connection.close());
