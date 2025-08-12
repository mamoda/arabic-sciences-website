import React from 'react';
import { BookOpen } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <BookOpen className="w-16 h-16 text-blue-600 mx-auto animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mt-4">
          Loading Scientific Books...
        </h3>
        <p className="text-gray-500 mt-2">
          Please wait while we fetch the latest publications
        </p>
      </div>
    </div>
  );
};