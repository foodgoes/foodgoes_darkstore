import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const AlertSchema = new Schema({
    name: {
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
    previewImage: {
        type: String,
        default: null
    },
    previewDescription: {
        en: {
            type: String,
            maxlength: 350
        },
        he: {
            type: String,
            maxlength: 350
        },
        ru: {
            type: String,
            maxlength: 350
        },
    },
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
    descriptionHtml: {
        en: {
            type: String,
            maxlength: 550
        },
        he: {
            type: String,
            maxlength: 550
        },
        ru: {
            type: String,
            maxlength: 550
        },
    },
    caption: {
        en: {
            type: String,
            maxlength: 550
        },
        he: {
            type: String,
            maxlength: 550
        },
        ru: {
            type: String,
            maxlength: 550
        },
    },
    action: {
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
    userIds: {
        type: Array,
        default: null
    },
    subjectType: {
        type: String,
        default: null
    },
    subjectId: {
        type: ObjectId,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    finishedAt: {
        type: Date,
        default: Date.now
    },
    enabled: {
        type: Boolean,
        default: false
    }
});

AlertSchema.set('toObject', { virtuals: true });
AlertSchema.set('toJSON', { virtuals: true });

export default mongoose.models.Alert || mongoose.model('Alert', AlertSchema)