import React, { useState } from 'react';
import { Download, Star, Eye, Calendar, FileText, User } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  field: string;
  publishedYear: number;
  pages: number;
  fileSize: string;
  downloadUrl: string;
  coverImage: string;
  rating: number;
  downloads: number;
}

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    // Simulate download process
    try {
      // In a real app, this would be an actual download
      setTimeout(() => {
        // Create a dummy download for demonstration
        const link = document.createElement('a');
        link.href = '#'; // Replace with actual file URL
        link.download = `${book.title.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setIsDownloading(false);
      }, 2000);
    } catch (error) {
      console.error('Download failed:', error);
      setIsDownloading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
        {!imageError ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
        {/* Field Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            {book.field}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="text-xs font-medium text-gray-700">
            {book.rating}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {book.title}
        </h3>
        
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <User className="w-4 h-4" />
          <span className="text-sm font-medium">{book.author}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {book.description}
        </p>

        {/* Book Details */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{book.publishedYear}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            <span>{book.pages} pages</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            <span>{book.downloads.toLocaleString()}</span>
          </div>
          <div className="text-right">
            <span className="font-medium">{book.fileSize}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex">
            {renderStars(book.rating)}
          </div>
          <span className="text-sm text-gray-600">
            ({book.rating}/5)
          </span>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            isDownloading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
          }`}
        >
          {isDownloading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
};