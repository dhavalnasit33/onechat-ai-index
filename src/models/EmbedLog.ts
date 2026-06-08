import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEmbedLog extends Document {
  chartId: string;
  refererUrl?: string;
  refererDomain?: string;
  userAgent?: string;
  ipHash?: string;
  servedAt: Date;
}

const EmbedLogSchema = new Schema<IEmbedLog>(
  {
    chartId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    refererUrl: {
      type: String,
      trim: true,
    },
    refererDomain: {
      type: String,
      index: true,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    ipHash: {
      type: String,
      trim: true,
    },
    servedAt: {
      type: Date,
      default: Date.now,
      index: true,
      expires: 31536000, // 365 days in seconds
    },
  },
  {
    collection: 'ai_index_embed_log',
  }
);

const EmbedLog: Model<IEmbedLog> =
  mongoose.models.EmbedLog || mongoose.model<IEmbedLog>('EmbedLog', EmbedLogSchema);

export default EmbedLog;
