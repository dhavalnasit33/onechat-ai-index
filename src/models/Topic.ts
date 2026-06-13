import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ITopic extends Document {
  categoryId: Types.ObjectId;
  slug: string;
  title: string;
  description: string;
  methodologyNote?: string;
  aboutData?: string;       // ← NEW: Tiptap formatted About this data section
  metaTitle?: string;
  keyphrase?: string;
  metaDescription?: string;
  ogImageUrl?: string;
  iconUrl?: string;        // ← NEW: uploaded icon image URL
  status: 'draft' | 'published' | 'archived';
  dataPointsCount: number;
  sourceCount: number;
  publishedAt?: Date;
  lastRefreshedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TopicSchema = new Schema<ITopic>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    methodologyNote: {
      type: String,
      default: '',
    },
    aboutData: {
      type: String,
      default: '',
    },
    metaTitle: {
      type: String,
      default: '',
    },
    keyphrase: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
    ogImageUrl: {
      type: String,
      default: '',
    },
    iconUrl: {           // ← NEW
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      required: true,
    },
    dataPointsCount: {
      type: Number,
      default: 0,
    },
    sourceCount: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
    },
    lastRefreshedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: 'ai_index_topics',
  }
);

// Compound unique index on { categoryId: 1, slug: 1 }
TopicSchema.index({ categoryId: 1, slug: 1 }, { unique: true });

// Text search index on { title: 'text', description: 'text' }
TopicSchema.index(
  { title: 'text', description: 'text' },
  {
    weights: { title: 10, description: 5 },
    name: 'TopicTextIndex',
  }
);

const Topic: Model<ITopic> =
  mongoose.models.Topic || mongoose.model<ITopic>('Topic', TopicSchema);

export default Topic;