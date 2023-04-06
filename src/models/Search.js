import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const SearchSchema = new Schema({
    keywords: {
        en: {
            type: Array,
            default: []
        },
        he: {
            type: Array,
            default: []
        },
        ru: {
            type: Array,
            default: []
        },
    },
    productIds: {
        type: Array,
        default: []
    },
    enabled: {
        type: Boolean,
        default: false
    }
});

SearchSchema.set('toObject', { virtuals: true });
SearchSchema.set('toJSON', { virtuals: true });

export default mongoose.models.Search || mongoose.model('Search', SearchSchema)