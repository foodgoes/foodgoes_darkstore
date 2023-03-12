import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Condition = new Schema({
    orderCountEqual: Number,
    totalLineItemsPriceMin: Number,
    everyDayOfWeek: Number
});
Condition.set('toObject', { virtuals: true });
Condition.set('toJSON', { virtuals: true });

const Rule = new Schema({
    column: String,
    relation: String,
    condition: String
});
Rule.set('toObject', { virtuals: true });
Rule.set('toJSON', { virtuals: true });

const DiscountSchema = new Schema({
    userIds: [ObjectId],
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
    description: {
        en: {
            type: String,
            maxlength: 660,
          },
        he: {
            type: String,
            maxlength: 660,
          },
        ru: {
            type: String,
            maxlength: 660,
          }
    },
    previewDescription: {
        en: {
            type: String,
            maxlength: 660,
          },
        he: {
            type: String,
            maxlength: 660,
          },
        ru: {
            type: String,
            maxlength: 660,
          }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 604800
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
    subjectType: {
        type: String,
        required: true,
        enum: ['products', 'shipping'],
        default: 'products'
    },
    percentage: {
        type: Number,
        default: 0
    },
    conditions: [Condition],
    ruleSet: {
        rules: [Rule]
    }
});

DiscountSchema.set('toObject', { virtuals: true });
DiscountSchema.set('toJSON', { virtuals: true });

export default mongoose.models.Discount || mongoose.model('Discount', DiscountSchema)