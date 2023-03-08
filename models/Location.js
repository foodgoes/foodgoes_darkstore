import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const LocationSchema = new Schema({
    userId: ObjectId,
    name: String,
    default: {
        type: Boolean,
        default: false
    },
    token: {
        type: String
    },
    address: {
        address1: String,
        address2: String,
        city: String,
        latitude: Number,
        longitude: Number,
        phone: String,
        zip: String,
        countryCode: String,
        provinceCode: String,
        country: String,
        province: String,
    },
    deactivatedAt: Date,
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
        default: true
    }
});

LocationSchema.set('toObject', { virtuals: true });
LocationSchema.set('toJSON', { virtuals: true });

export default mongoose.models.Location || mongoose.model('Location', LocationSchema)