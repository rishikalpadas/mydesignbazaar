"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [designs, setDesigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setError('No search query provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(`/api/designs/search?q=${encodeURIComponent(query)}`);
        setDesigns(response.data.designs || []);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to fetch search results');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <>
      <Navbar />
      <main className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Search Results
            </h1>
            <p className="text-gray-600">
              {isLoading ? 'Loading...' : `Found ${designs.length} design${designs.length !== 1 ? 's' : ''} matching "${query}"`}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : designs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {designs.map((design) => (
                <div
                  key={design._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group cursor-pointer"
                  onClick={() => window.location.href = `/product/details/${design._id}`}
                >
                  {/* Image */}
                  <div className="relative bg-gray-100 h-48 overflow-hidden">
                    {design.previewImageUrls && design.previewImageUrls[0] && (
                      <img
                        src={design.previewImageUrls[0].url}
                        alt={design.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="inline-block bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">
                        {design.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
                      {design.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">
                      ID: {design.designId}
                    </p>

                    {/* Tags */}
                    {design.tags && design.tags.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1">
                        {design.tags.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                        {design.tags.length > 2 && (
                          <span className="text-xs text-gray-500">+{design.tags.length - 2} more</span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs py-2 rounded transition-colors">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg mb-2">No designs found</p>
              <p className="text-gray-500">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SearchPage;
