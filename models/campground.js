const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function ()
{
    return this.url.replace('/upload', '/upload/w_150');
});

const CampgroundSchema = new Schema(
    {
        title: String,
        price: Number,
        description: String,
        location: String,
        geometry: {
            type: {
                type: String, // Don't do `{ location: { type: String } }`
                enum: ['Point'], // 'location.type' must be 'Point'
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        images: [ImageSchema],
        reviews: [{
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }],
        date: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    { toJSON: { virtuals: true } }
);

CampgroundSchema.virtual('properties.popup').get(function ()
{
    return `<a href="/campgrounds/${this._id}" class="text-success text-decoration-none font-weight-bold">${this.title} - ${this.location}</a>
    <p>${this.description.substring(0, 100)}...</p>`;
});

CampgroundSchema.post('findOneAndDelete', async function (doc)
{
    if (doc)
    {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        });
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);