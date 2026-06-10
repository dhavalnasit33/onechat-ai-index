import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ISource {
  position?: number;
  sourceName?: string;
  sourceUrl?: string;
  publication?: string;
  publicationDate?: Date;
}

export interface IChart extends Document {
  topicId: Types.ObjectId;
  chartId: string;
  position: number;
  title: string;
  chartType: "vbar" | "hbar" | "line" | "donut" | "hero_stat";
  data: any;
  sourceLine?: string;
  imageUrl?: string;
  imageUpdatedAt?: Date;
  status: "active" | "removed";
  sources: ISource[];
  heading?: string;
  icon?: string;
  displayHome?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SourceSchema = new Schema<ISource>(
  {
    position: {
      type: Number,
    },
    sourceName: {
      type: String,
      trim: true,
    },
    sourceUrl: {
      type: String,
      trim: true,
    },
    publication: {
      type: String,
      trim: true,
    },
    publicationDate: {
      type: Date,
    },
  },
  { _id: false },
);

const ChartSchema = new Schema<IChart>(
  {
    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    chartId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    position: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    chartType: {
      type: String,
      enum: [
        "vbar",
        "hbar",
        "line",
        "donut",
        "hero_stat",
        "timeline",
        "text_block",
      ],
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    sourceLine: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    imageUpdatedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "removed"],
      default: "active",
      required: true,
    },
    heading: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    displayHome: {
      type: Boolean,
      default: false,
    },
    sources: [SourceSchema],
  },
  {
    timestamps: true,
    collection: "ai_index_charts",
  },
);

// Index: { topicId: 1, position: 1 }
ChartSchema.index({ topicId: 1, position: 1 });

const Chart: Model<IChart> =
  mongoose.models.Chart || mongoose.model<IChart>("Chart", ChartSchema);

export default Chart;
