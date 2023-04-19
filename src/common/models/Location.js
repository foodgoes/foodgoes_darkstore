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
        address1: {
            type: String,
            required: true
        },
        address2: String,
        zip: String,
        flat: String,
        entrance: String,
        floor: String,
        doorcode: String,
        country: String,
        city: String,
        province: String,
        countryCode: String,
        provinceCode: String,
        latitude: Number,
        longitude: Number,
        company: String,
        firstName: String,
        lastName: String,
        phone: String,
        comment: String,
        options: {
            leaveAtTheDoor: Boolean,
            meetOutside: Boolean,
            noDoorCall: Boolean,
        }
    },
    deactivatedAt: Date,
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
        default: true
    }
});

LocationSchema.set('toObject', { virtuals: true });
LocationSchema.set('toJSON', { virtuals: true });

export default mongoose.models.Location || mongoose.model('Location', LocationSchema)