import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ProductCart = new Schema({
    productId: {
        type: ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
});
ProductCart.set('toObject', { virtuals: true });
ProductCart.set('toJSON', { virtuals: true });

const CartSchema = new Schema({
    userId: ObjectId,
    token: {
        type: String
    },
    totalShippingPrice: {
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
    minTotalPrice: {
        type: Number,
        default: 0
    },
    products: [ProductCart],
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 604800
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

CartSchema.set('toObject', { virtuals: true });
CartSchema.set('toJSON', { virtuals: true });

export default mongoose.models.Cart || mongoose.model('Cart', CartSchema)