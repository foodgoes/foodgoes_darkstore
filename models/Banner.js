import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const BannerSchema = new Schema({
    image: {
        type: String,
        default: null
    },
    title: {
        en: {
            type: String,
            maxlength: 255
        },
        he: {
            type: String,
            maxlength: 255
        },
        ru: {
            type: String,
            maxlength: 255
        },
    },
    url: String,
    sort: Number,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 604800
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    enabled: {
        type: Boolean,
        default: false
    },
});

BannerSchema.set('toObject', { virtuals: true });
BannerSchema.set('toJSON', { virtuals: true });

export default mongoose.models.Banner || mongoose.model('Banner', BannerSchema)