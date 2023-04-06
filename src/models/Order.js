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

const Discount = new Schema({
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
    ruleSet: {
        rules: [Rule]
    },
    percentage: Number,
    subjectType: String,
    conditions: [Condition]
});
Discount.set('toObject', { virtuals: true });
Discount.set('toJSON', { virtuals: true });

const ShippingAddress = new Schema({
    address1: String,
    address2: String,
    city: String,
    company: String,
    firstName: String,
    lastName: String,
    latitude: Number,
    longitude: Number,
    phone: String,
    zip: String,
    countryCode: String,
    provinceCode: String,
    country: String,
    province: String
});
ShippingAddress.set('toObject', { virtuals: true });
ShippingAddress.virtual('name').get(function() {
    let displayName = '';

    if (this.firstName || this.lastName) {
        const name = [];
        if (this.firstName) name.push(this.firstName);
        if (this.lastName) name.push(this.lastName);
        displayName = name.join(' ');
    }

    return displayName;
});

const LineItem = new Schema({
    productId: {
        type: ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        maxlength: 4,
    },
    unitCost: {
        type: Number,
        min: 0.00,
        maxlength: 15,
        default: 0.00
    },
    price: {
        type: Number,
        min: 0.00,
        maxlength: 15,
        default: 0.00
    },
    compareAtPrice: {
        type: Number,
        min: 0.00,
        maxlength: 15,
        default: 0.00
    },
    pricePerUnit: {
        type: Number,
        min: 0.00,
        maxlength: 15,
        default: 0.00
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
    brand: {
        en: {
            type: String,
            maxlength: 100
        },
        he: {
            type: String,
            maxlength: 100
        },
        ru: {
            type: String,
            maxlength: 100
        }
    },
    weightUnit: {
        type: String,
        required: true,
        enum: ['g', 'kg', 'oz', 'lb'],
        default: 'g'
    },
    weight: {
        type: Number,
        default: 0
    },
    unit: {
        type: String,
        required: true,
        enum: ['g', 'kg', 'oz', 'lb', 'pc', 'ml', 'L'],
        default: 'g'
    },
    amountPerUnit: {
        type: Number,
        default: 0
    },
    displayAmount: String,
});
LineItem.set('toObject', { virtuals: true });
LineItem.set('toJSON', { virtuals: true });

const OrderSchema = new Schema({
    userId: {
        type: ObjectId,
        required: true
    },
    number: Number,
    orderNumber: Number,
    token: {
        type: String,
        unique: true
    },
    totalShippingPrice: {
        type: Number,
        default: 0
    },
    totalTax: {
        type: Number,
        default: 0
    },
    totalLineItemsPrice: {
        type: Number,
        default: 0
    },
    totalDiscounts: {
        type: Number,
        default: 0
    },
    subtotalPrice: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    financialStatus: {
        type: String,
        enum: ['pending', 'authorized', ' partially_paid', 'paid', 'partially_refunded', 'refunded', 'voided', 'expired'],
        default: null
    },
    fulfillmentStatus: {
        type: String,
        enum: ['fulfilled', 'in_progress', 'open', 'partially_fulfilled', 'pending_fulfillment', 'restocked',
            'scheduled', 'unfulfilled'],
        default: null
    },
    lineItems: [LineItem],
    shippingAddress: ShippingAddress,
    discounts: [Discount],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    test: {
        type: Boolean,
        default: false
    },
});

OrderSchema.set('toObject', { virtuals: true });
OrderSchema.set('toJSON', { virtuals: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)