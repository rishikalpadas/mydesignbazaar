import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Admin Schema (defined directly here to avoid import issues)
const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  role: {
    type: String,
    enum: ['super_admin', 'designer_admin', 'buyer_admin'],
    required: true,
  },
  permissions: [{
    type: String,
    enum: [
      'manage_designers',
      'manage_buyers', 
      'manage_designs',
      'manage_payments',
      'manage_orders',
      'view_analytics',
      'manage_admins',
      'system_settings'
    ]
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Database connection function
async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return true;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
}

export async function POST(request) {
  try {
    // Check MongoDB URI
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: 'MONGODB_URI not configured' },
        { status: 500 }
      );
    }

    // Security check - only allow in development or with secret key
    const { setupKey } = await request.json();
    
    if (process.env.NODE_ENV === 'production' && setupKey !== process.env.SETUP_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized setup attempt' },
        { status: 401 }
      );
    }
    
    // Allow any setup key in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: allowing database setup');
    }

    // Connect to database
    const connected = await connectDB();
    if (!connected) {
      return NextResponse.json(
        { error: 'Failed to connect to database' },
        { status: 500 }
      );
    }

    // Get or create Admin model
    const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

    // Define the three master admin accounts
    const adminAccounts = [
      {
        email: 'admin@mydesignbazaar.com',
        password: 'Admin@123!MDB',
        name: 'Super Administrator',
        role: 'super_admin',
        permissions: [
          'manage_designers',
          'manage_buyers',
          'manage_designs',
          'manage_payments',
          'manage_orders',
          'view_analytics',
          'manage_admins',
          'system_settings'
        ]
      },
      {
        email: 'designer@mydesignbazaar.com',
        password: 'Designer@123!MDB',
        name: 'Designer Administrator',
        role: 'designer_admin',
        permissions: [
          'manage_designers',
          'manage_designs',
          'view_analytics'
        ]
      },
      {
        email: 'buyer@mydesignbazaar.com',
        password: 'Buyer@123!MDB',
        name: 'Buyer Administrator',
        role: 'buyer_admin',
        permissions: [
          'manage_buyers',
          'manage_orders',
          'manage_payments',
          'view_analytics'
        ]
      }
    ];

    const results = [];

    for (const adminData of adminAccounts) {
      try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: adminData.email });
        
        if (existingAdmin) {
          results.push({
            email: adminData.email,
            status: 'already_exists',
            role: adminData.role
          });
          continue;
        }

        // Create new admin
        const admin = new Admin(adminData);
        await admin.save();
        
        results.push({
          email: adminData.email,
          status: 'created',
          role: adminData.role,
          password: adminData.password // Only show password for newly created accounts
        });
      } catch (adminError) {
        console.error(`Error creating admin ${adminData.email}:`, adminError);
        results.push({
          email: adminData.email,
          status: 'error',
          role: adminData.role,
          error: adminError.message
        });
      }
    }

    return NextResponse.json({
      message: 'Database setup completed successfully',
      results: results,
      securityNote: 'Please change default passwords immediately after first login'
    });

  } catch (error) {
    console.error('Database setup error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Duplicate key error - some admins may already exist' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: `Failed to setup database: ${error.message}` },
      { status: 500 }
    );
  }
}

// For development convenience
export async function GET(request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Setup endpoint only available in development' },
      { status: 403 }
    );
  }

  return NextResponse.json({
    message: 'Database setup endpoint',
    instruction: 'Send a POST request to setup admin accounts',
    note: 'Include setupKey in request body for production',
    mongoUri: process.env.MONGODB_URI ? 'Connected' : 'Not configured'
  });
}