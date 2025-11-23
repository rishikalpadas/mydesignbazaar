import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import { User_Subscription_Credits } from '../../../models/Subscription';

export async function GET(request) {
  try {
    await connectDB();
    
    // Test if the model is registered
    console.log('User_Subscription_Credits model:', User_Subscription_Credits);
    console.log('Model name:', User_Subscription_Credits.modelName);
    console.log('Collection name:', User_Subscription_Credits.collection.name);
    
    // Try to count documents
    const count = await User_Subscription_Credits.countDocuments();
    
    // Try to find all documents
    const allRecords = await User_Subscription_Credits.find().limit(10);
    
    return NextResponse.json({
      success: true,
      message: 'Schema test successful',
      modelName: User_Subscription_Credits.modelName,
      collectionName: User_Subscription_Credits.collection.name,
      documentCount: count,
      sampleRecords: allRecords
    });
  } catch (error) {
    console.error('Schema test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
