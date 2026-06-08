import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChartHistory extends Document {
  chartId: string;
  data: any;
  sourceLine?: string;
  changedBy?: string;
  changedAt: Date;
  changeNote?: string;
}

const ChartHistorySchema = new Schema<IChartHistory>(
  {
    chartId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    sourceLine: {
      type: String,
      default: '',
    },
    changedBy: {
      type: String,
      default: 'system',
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    changeNote: {
      type: String,
      default: '',
    },
  },
  {
    collection: 'ai_index_chart_history',
  }
);

const ChartHistory: Model<IChartHistory> =
  mongoose.models.ChartHistory || mongoose.model<IChartHistory>('ChartHistory', ChartHistorySchema);

export default ChartHistory;
