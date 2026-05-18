// models/Package.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPackage extends Document {
  name: string;
  slug: string;
  price: number;
  speed: string;
  speedMbps: number;
  features: string[];
  isPopular: boolean;
  buttonText: string;
  icon: string;
  color: string;
  iconBg: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    name: {
      type: String,
      required: [true, 'Package name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    speed: {
      type: String,
      required: [true, 'Speed is required'],
      trim: true,
    },
    speedMbps: {
      type: Number,
      required: [true, 'Speed in Mbps is required'],
      min: 0,
    },
    features: {
      type: [String],
      required: [true, 'At least one feature is required'],
      validate: {
        validator: (v: string[]) => v && v.length > 0,
        message: 'At least one feature is required',
      },
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    buttonText: {
      type: String,
      required: [true, 'Button text is required'],
      default: 'Choose Plan',
    },
    icon: {
      type: String,
      required: [true, 'Icon name is required'],
    },
    color: {
      type: String,
      required: [true, 'Color gradient is required'],
    },
    iconBg: {
      type: String,
      required: [true, 'Icon background gradient is required'],
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for better query performance
PackageSchema.index({ isActive: 1, displayOrder: 1 });

// Check if model exists to prevent overwriting during hot reload
const Package: Model<IPackage> = mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema);

export default Package;