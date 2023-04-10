import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const LinkSecond = new Schema({
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
    subjectId: ObjectId,
    subjectParams: {
        type: String,
        default: null
    }
});
LinkSecond.set('toObject', { virtuals: true });
LinkSecond.set('toJSON', { virtuals: true });

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
    subjectId: ObjectId,
    subjectParams: {
        type: String,
        default: null
    },
    links: [LinkSecond]
});
Link.set('toObject', { virtuals: true });
Link.set('toJSON', { virtuals: true });

const CategorySchema = new Schema({
    image: {
        type: String,
        default: null
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
    },
    hidden: {
        type: Boolean,
        default: false
    }
});

CategorySchema.set('toObject', { virtuals: true });
CategorySchema.set('toJSON', { virtuals: true });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema)