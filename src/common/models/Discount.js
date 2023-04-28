import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const DiscountSchema = new Schema({
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
    code: String,
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
    status: {
        type: String,
        required: true,
        enum: ['active', 'archived', 'draft'],
        default: 'draft'
    },
    products: {
        all: {
            enabled: {
                type: Boolean,
                default: false
            },
            percentage: {
                type: Number,
                default: 0
            },
            excludeProductIds: {
                type: Array,
                default: []
            }
        },
        custom: [{
            productId: ObjectId,
            percentage: {
                type: Number,
                default: 0
            },
            amount: {
                type: Number,
                min: 0.00,
                maxlength: 15,
                default: 0.00
            },
            quantity: {
                type: Number,
                default: 0
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
            isLabel: {
                type: Boolean,
                default: false
            }
        }]
    },
    shipping: {
        all: {
            enabled: {
                type: Boolean,
                default: false
            },
            percentage: {
                type: Number,
                default: 0
            }
        }
    },
    order: {
        minTotalPrice: {
            type: Number,
            default: 0
        }
    }
});

DiscountSchema.set('toObject', { virtuals: true });
DiscountSchema.set('toJSON', { virtuals: true });

export default mongoose.models.Discount || mongoose.model('Discount', DiscountSchema)