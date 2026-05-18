import mongoose, { Schema, model, models } from 'mongoose';

export interface IUser extends mongoose.Document {
  customerId?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  password: string;
  role: 'admin' | 'customer';
  isActive: boolean;
  tempPassword?: string;
  package: mongoose.Types.ObjectId | null; // Reference to Package model
  packageDetails?: any; // For populated data
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  customerId: { 
    type: String, 
    unique: true, 
    sparse: true,
    required: false
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  isActive: { type: Boolean, default: true },
  tempPassword: { type: String },
  package: { 
    type: Schema.Types.ObjectId, 
    ref: 'Package',
    required: false,
    default: null
  },
  createdAt: { type: Date, default: Date.now }
});

// Updated Customer ID generation function - Using A1C + random numbers
export function generateCustomerId(): string {
  // Use "A1C" prefix
  const prefix = "A1C";
  
  // Generate 6 random digits (100000 to 999999)
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  
  // Format: A1C + 6 random digits (e.g., A1C123456)
  return `${prefix}${randomNum}`;
}

export const User = models.User || model<IUser>('User', UserSchema);