import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  slug: string;
  name: string;
  description?: string;
  position: number;
  topicCount: number;
  iconUrl?: string;        // ← NEW: uploaded icon image URL
  keyphrase?: string;
  metaTitle?: string;
  metaDescription?: string;
  featuredImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    position: {
      type: Number,
      default: 0,
    },
    topicCount: {
      type: Number,
      default: 0,
    },
    iconUrl: {           // ← NEW
      type: String,
      default: '',
    },
    keyphrase: {
      type: String,
      default: '',
    },
    metaTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
    featuredImage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'ai_index_categories',
  }
);

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;