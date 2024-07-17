import { Schema, model } from 'mongoose';

interface IAsset {
  symbol: string;
  price: number;
  timestamp: Date;
}

const assetSchema = new Schema<IAsset>({
  symbol: { type: String, required: true },
  price: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Asset = model<IAsset>('Asset', assetSchema);

export default Asset;
