import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const Firebase = new Schema({
    externalId: String
});
Firebase.set('toObject', { virtuals: true });
Firebase.set('toJSON', { virtuals: true });

const UserSchema = new Schema({
    firstName: {
        type: String,
        default: null
    },
    lastName: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    username: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    password: String,
    locale: {
        type: String,
        default: null
    },
    sex: {
        type: String,
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
    providers: {
        firebase: Firebase
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

UserSchema.index({ 'username': 1}, { 'unique': true,
    partialFilterExpression: {username: { $type: 'string' }} });
UserSchema.index({ 'phone': 1}, { 'unique': true,
    partialFilterExpression: {phone: { $type: 'string' }} });

UserSchema.virtual('displayName').get(function() {
    const name = [this.firstName];
    if (this.lastName) name.push(this.lastName);

    return name.join(' ');
});

export default mongoose.models.User || mongoose.model('User', UserSchema)