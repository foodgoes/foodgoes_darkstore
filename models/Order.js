import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

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
    price: {
        type: Number,
        maxlength: 15,
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