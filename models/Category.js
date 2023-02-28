import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const Link = new Schema({
    enabled: {
        type: Boolean,
        default: false
    },
    title: {
        en: {
            type: String,
            maxlength: 255,
            required: true
        },
        he: {
            type: String,
            maxlength: 255,
            required: true
        },
        ru: {
            type: String,
            maxlength: 255,
            required: true
        },
    },
    sort: Number,
    handle: {
        type: String,
        maxlength: 510
    },
    subject: {
        type: String,
        maxlength: 1500,
    },
    subjectId: {
        type: String,
        default: null
    },
    subjectParams: {
        type: String,
        default: null
    },
    type: {
        type: String,
        default: 'http'
    },
    links: [],
});
Link.set('toObject', { virtuals: true });
Link.set('toJSON', { virtuals: true });

const CategorySchema = new Schema({
    title: {
        en: {
            type: String,
            maxlength: 255,
            required: true
        },
        he: {
            type: String,
            maxlength: 255,
            required: true
        },
        ru: {
            type: String,
            maxlength: 255,
            required: true
        },
    },
    sort: Number,
    links: [Link],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    enabled: {
        type: Boolean,
        default: false
    }
});

CategorySchema.set('toObject', { virtuals: true });
CategorySchema.set('toJSON', { virtuals: true });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema)