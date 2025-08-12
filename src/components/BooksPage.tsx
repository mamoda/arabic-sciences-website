import React, { useState, useEffect } from 'react';
import { BookCard } from './BookCard';
import { SearchBar } from './SearchBar';
import { FilterDropdown } from './FilterDropdown';
import { LoadingSpinner } from './LoadingSpinner';
import { BookOpen, Filter } from 'lucide-react';

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

interface BooksPageProps {
  field: string;
}

export const BooksPage: React.FC<BooksPageProps> = ({ field = "Computer Science" }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('title');

  // Mock data - replace with actual API call
  const mockBooks: Book[] = [
    {
      id: '1',
      title: 'Advanced Machine Learning Algorithms',
      author: 'Dr. Sarah Chen',
      description: 'A comprehensive guide to modern machine learning techniques including deep learning, neural networks, and advanced statistical methods.',
      field: 'Computer Science',
      publishedYear: 2023,
      pages: 456,
      fileSize: '12.3 MB',
      downloadUrl: '#',
      coverImage: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
      rating: 4.8,
      downloads: 15420
    },
    {
      id: '2',
      title: 'Quantum Computing Fundamentals',
      author: 'Prof. Michael Rodriguez',
      description: 'Explore the fascinating world of quantum computing, from basic principles to practical applications in modern technology.',
      field: 'Physics',
      publishedYear: 2023,
      pages: 324,
      fileSize: '8.7 MB',
      downloadUrl: '#',
      coverImage: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg',
      rating: 4.6,
      downloads: 9870
    },
    {
      id: '3',
      title: 'Biomedical Data Analysis',
      author: 'Dr. Emily Watson',
      description: 'Statistical methods and computational approaches for analyzing complex biomedical datasets and clinical research data.',
      field: 'Biology',
      publishedYear: 2022,
      pages: 398,
      fileSize: '15.1 MB',
      downloadUrl: '#',
      coverImage: 'https://images.pexels.com/photos/207662/pexels-photo-207662.jpeg',
      rating: 4.7,
      downloads: 12340
    },
    {
      id: '4',
      title: 'Modern Cryptography Protocols',
      author: 'Dr. James Liu',
      description: 'Advanced cryptographic techniques and security protocols for secure communication in the digital age.',
      field: 'Computer Science',
      publishedYear: 2023,
      pages: 512,
      fileSize: '18.9 MB',
      downloadUrl: '#',
      coverImage: 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg',
      rating: 4.9,
      downloads: 18650
    },
    {
      id: '5',
      title: 'Climate Science Modeling',
      author: 'Prof. Anna Kowalski',
      description: 'Mathematical models and computational methods for understanding and predicting climate change patterns.',
      field: 'Environmental Science',
      publishedYear: 2023,
      pages: 367,
      fileSize: '11.2 MB',
      downloadUrl: '#',
      coverImage: 'https://images.pexels.com/photos/159775/library-books-education-literature-159775.jpeg',
      rating: 4.5,
      downloads: 7890
    },
    {
      id: '6',
      title: 'Neural Network Architectures',
      author: 'Dr. Robert Kim',
      description: 'Deep dive into various neural network architectures and their applications in artificial intelligence.',
      field: 'Computer Science',
      publishedYear: 2022,
      pages: 445,
      fileSize: '16.4 MB',
      downloadUrl: '#',
      coverImage: 'https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg',
      rating: 4.8,
      downloads: 14230
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const fieldBooks = mockBooks.filter(book => 
        field === 'All Fields' || book.field === field
      );
      setBooks(fieldBooks);
      setFilteredBooks(fieldBooks);
      setLoading(false);
    }, 1000);
  }, [field]);

  useEffect(() => {
    let filtered = books.filter(book =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort books
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'year':
          return b.publishedYear - a.publishedYear;
        case 'rating':
          return b.rating - a.rating;
        case 'downloads':
          return b.downloads - a.downloads;
        default:
          return 0;
      }
    });

    setFilteredBooks(filtered);
  }, [books, searchQuery, sortBy]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Scientific Books - {field}
              </h1>
              <p className="text-gray-600 mt-1">
                Discover and download high-quality scientific literature
              </p>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <SearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Search books by title, author, or keywords..."
            />
            
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-500" />
              <FilterDropdown
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { value: 'title', label: 'Title A-Z' },
                  { value: 'author', label: 'Author A-Z' },
                  { value: 'year', label: 'Newest First' },
                  { value: 'rating', label: 'Highest Rated' },
                  { value: 'downloads', label: 'Most Downloaded' }
                ]}
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredBooks.length} of {books.length} books
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No books found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};