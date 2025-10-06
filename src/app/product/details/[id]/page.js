"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Share2, Eye, Download, Calendar, User, Tag, ShoppingCart, Star, Brush } from 'lucide-react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import Newsletter from '../../../../components/Newsletter';
import SimilarDesignsSlider from '../../../../components/SimilarDesignsSlider';

// Custom Skeleton Component
const Skeleton = ({ className = "", ...props }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      {...props}
    />
  );
};

// Product View Skeleton
const ProductViewSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section Skeleton */}
          <div className="space-y-4">
            <Skeleton className="w-full h-96 rounded-lg" />
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="w-16 h-16 rounded-md" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-3/4" />
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="w-5 h-5 rounded" />
                  ))}
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            </div>

            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-20 w-full" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>

            <div className="space-y-3">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            <div className="flex space-x-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Product View Component
const ProductView = ({ productData, isLoading = false }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');

  // Set base URL client-side to avoid SSR issues
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    }
  }, []);


  // Show skeleton if loading, no product data, or baseUrl not set
  if (isLoading) {
    return <ProductViewSkeleton />;
  }

  const product = productData;

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'N/A';
  };

  // Normalize URL to avoid double slashes
  const normalizeUrl = (path) => {
    if (!path) return '/placeholder.jpg';
    return `${baseUrl}/${path.startsWith('/') ? path : `/${path}`}`.replace(/([^:]\/)\/+/g, '$1');
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-gray-50 rounded-lg overflow-hidden border">
              <Image
                src={normalizeUrl(product?.previewImageUrls?.[selectedImageIndex]?.url)}
                alt={product?.title || 'Product Image'}
                className="w-full h-96 object-contain"
                priority
                width={800}
                height={600}
              />
              {product?.featured && (
                <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-2 overflow-x-auto">
              {product?.previewImageUrls?.map((image, index) => (
                <button
                  key={image?._id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-md border-2 overflow-hidden ${
                    selectedImageIndex === index
                      ? 'border-orange-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={normalizeUrl(image?.url)}
                    alt={`${product?.title || 'Product'} preview ${index + 1}`}
                    className="w-full h-full object-cover"
                    width={64}
                    height={64}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Title and Category */}
            <div className="space-y-3">
              <div className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                {product?.category || 'N/A'}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{product?.title || 'Untitled'}</h1>
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(Based on quality)</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">About this design</h3>
              <p className="text-gray-700 leading-relaxed">
                {product?.description}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">Views</span>
                </div>
                <span className="font-semibold text-gray-900">{product?.views?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Download className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">Downloads</span>
                </div>
                <span className="font-semibold text-gray-900">{product?.downloads?.toLocaleString() || '0'}</span>
              </div>
            </div>

            {/* Tags */}
            {product?.tags && product?.tags?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product?.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <a
                href={normalizeUrl(product?.rawFileUrls?.[0]?.url) || '#'}
                download={product?.rawFileUrls?.[0]?.originalName || 'design.pdf'}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download Design</span>
              </a>
              <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-900 font-medium py-2 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Social Actions */}
            <div className="flex items-center space-x-4 pt-4 border-t">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  isLiked
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">Like</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                <Share2 className="w-5 h-5" />
                <span className="text-sm">Share</span>
              </button>
            </div>

            {/* Additional Info */}
            <div className="text-sm text-gray-500 space-y-1 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Brush className="w-4 h-4" />
                <span>Design ID: {product?.designId || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Uploaded: {formatDate(product?.uploadDate)}</span>
              </div>
              
              {/* {product?.approvalDate && (
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Approved: {formatDate(product?.approvalDate)}</span>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo Component with Loading State
const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const fetchDesign = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/product/${id}`, {
        withCredentials: true,
      });
      console.log("data",response?.data?.data);
      setProductData(response?.data?.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching product data:', error);
      setError('Failed to load product data. Please try again.');
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchDesign();
    }
  }, [id, fetchDesign]);

  if (error) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-red-200">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <ProductView productData={productData} isLoading={isLoading} />
      {/* Similar Designs Section */}
      {!isLoading && productData && (
        <SimilarDesignsSlider currentDesignId={id} />
      )}
    </div>
  );
};

const ProductPage = () => {
  return (
    <>
      <Navbar />
      <main className="bg-gray-50">
        <Page />
      </main>
      {/* <Newsletter /> */}
      <Footer />
    </>
  )
}

export default ProductPage