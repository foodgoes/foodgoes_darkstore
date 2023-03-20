import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
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
    handle: {
        type: String,
        maxlength: 510
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
    sort: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'archived', 'draft'],
        default: 'draft'
      },
    quantity: {
        type: Number,
        default: 0
    },
    images: {
        type: Array,
        default: []
    },
    forAdults: {
        type: Boolean,
        default: false
    },
    excludeDiscount: {
        type: Boolean,
        default: false
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
        enum: ['g', 'kg', 'oz', 'lb', 'pc', 'ml'],
        default: 'g'
    },
    amountPerUnit: {
        type: Number,
        default: 0
    },
    displayAmount: String,
    country: {
        en: {
            type: String,
            maxlength: 100,
          },
        he: {
            type: String,
            maxlength: 100,
          },
        ru: {
            type: String,
            maxlength: 100,
          }
    },
    disclaimer: {
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
    ingredients: {
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
    manufacturer: {
        en: {
            type: String,
            maxlength: 300,
          },
        he: {
            type: String,
            maxlength: 300,
          },
        ru: {
            type: String,
            maxlength: 300,
          }
    },
    shelfLife: {
        en: {
            type: String,
            maxlength: 300,
          },
        he: {
            type: String,
            maxlength: 300,
          },
        ru: {
            type: String,
            maxlength: 300,
          }
    },
    currencyCode: {
        type: String,
        required: true,
        default: 'ILS'
    }
});

ProductSchema.set('toObject', { virtuals: true });
ProductSchema.set('toJSON', { virtuals: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)