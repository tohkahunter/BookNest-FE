// src/app/pages/BookDetail/BookDetail.jsx - Updated with Author Section
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/Header';
import './styles/BookDetail.css';
import Footer from '../../components/Footer';

function BookDetail() {
  const { id } = useParams();
  
  // State for interactive features
  const [userRating, setUserRating] = useState(0);
  const [readingStatus, setReadingStatus] = useState('want-to-read');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);

  // Mock data
  const book = {
    id: id,
    title: "The First Days",
    subtitle: "As the World Dies, #1",
    author: "Rhiannon Frater",
    cover: "https://product.hstatic.net/200000301138/product/71418a942cd3034cb029ee888374a583_8da6b5ef2a094805ad5ceba1f30ec828.jpg",
    rating: 4.12,
    ratingCount: 15847,
    description: "The wheels of destiny had turned, and a new reality was being spun into existence. Katie and Jenni have just witnessed the zombie apocalypse begin. Now they must flee their Texas town and find a safe place to make their last stand against the living dead. This gripping tale follows two women as they navigate a world turned upside down, where survival means making impossible choices and finding strength in unexpected places.",
    pages: 331,
    format: "Paperback",
    published: "August 14, 2008",
    publisher: "Permuted Press",
    isbn: "978-1934861042",
    language: "English",
    genres: ["Horror", "Zombies", "Post Apocalyptic", "Fiction", "Fantasy", "Urban Fantasy"],
    // Author information
    authorInfo: {
      name: "Rhiannon Frater",
      avatar: "https://images.goodreads.com/authors/1234567890p5/123456.jpg",
      booksCount: 67,
      followersCount: 1653,
      isVerified: true,
      bio: `Rhiannon Frater is the award-winning author of the As the World Dies zombie trilogy (Tor) as well as independent works such as The Last Bastion of the Living (declared the #1 Zombie Release of 2012 by Explorations Fantasy Blog and the #1 Zombie Novel of the Decade by B&N Book Blog).

She was born and raised in Texas where she currently resides with her husband and furry children (a.k.a pets).

She loves scary movies, sci-fi and horror shows, playing video games, cooking, dyeing her hair weird colors, and shopping for Betsey Johnson purses and shoes.`
    }
  };

  const statusOptions = {
    'want-to-read': { label: 'Want to Read', color: 'bg-green-600 hover:bg-green-700' },
    'currently-reading': { label: 'Currently Reading', color: 'bg-blue-600 hover:bg-blue-700' },
    'read': { label: 'Read', color: 'bg-gray-600 hover:bg-gray-700' }
  };

  const handleRatingClick = (rating) => {
    setUserRating(rating);
  };

  const handleFollowAuthor = () => {
    setIsFollowingAuthor(!isFollowingAuthor);
  };

  const truncatedDescription = book.description.length > 300 
    ? book.description.slice(0, 300) + '...'
    : book.description;

  return (
    <div className="min-h-screen bg-white-50">
     

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Book Cover and Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 w-80">
              {/* Book Cover */}
              <div className="mb-6">
                <div className="w-full max-w-sm mx-auto sticky top-4">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full rounded-xl"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.innerHTML = `
                        <div class="w-full h-96 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-lg flex items-center justify-center text-white text-center p-4">
                          <div>
                            <h3 class="text-3xl font-bold mb-2">${book.title}</h3>
                            <p class="text-sm opacity-80">${book.author}</p>
                          </div>
                        </div>
                      `;
                    }}
                  />
                </div>
              </div>

              {/* Reading Actions */}
              <div className="bg-white rounded-lg p-2 space-y-4 text-center flex flex-col items-center">

                {/* Status Dropdown */}
                <div className="relative w-[200px]">
                  <select 
                    value={readingStatus}
                    onChange={(e) => setReadingStatus(e.target.value)}
                    className={`text-center w-full text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 ${statusOptions[readingStatus].color} appearance-none cursor-pointer`}
                  >
                    {Object.entries(statusOptions).map(([key, option]) => (
                      <option key={key} value={key} className="text-gray-900">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-2/2 transform -translate-y-1/2 h-5 w-5 text-white pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Interactive Rating */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                      key={star} 
                      onClick={() => handleRatingClick(star)}
                      className={`text-2xl transition-all duration-200 hover:scale-110 transform ${
                        star <= userRating ? 'text-orange-400' : 'text-gray-300 hover:text-orange-300'
                      }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                    <label className="block text-sm font-medium text-gray-700">Rate this book</label>
                  {userRating > 0 && (
                    <p className="text-sm text-gray-600">Your rating: {userRating}/5</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Book Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Book Info */}
            <div className="bg-white rounded-lg p-2">
              {book.subtitle && (
                <h2 className="text-2xl text-gray-600 mb-3">{book.subtitle}</h2>
              )}
              <h1 className="text-5xl text-gray-900 mb-2">{book.title}</h1>
              <p className="text-gray-600 mb-4">
                by <button className="text-orange-600 text-2xl hover:text-orange-700 hover:underline font-medium">{book.author}</button>
              </p>
              
              {/* Rating Display */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`text-4xl ${star <= Math.floor(book.rating) ? 'text-orange-400' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-3xl font-bold text-gray-900">{book.rating}</span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-600">{book.ratingCount.toLocaleString()} ratings</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-2">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {showFullDescription ? book.description : truncatedDescription}
              </p>
              {book.description.length > 300 && (
                <button 
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-2 text-orange-600 hover:text-orange-700 font-medium hover:underline"
                >
                  {showFullDescription ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>

            {/* Genres */}
            <div className="bg-white rounded-lg p-2">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {book.genres.map((genre, index) => (
                  <button key={index} className="px-3 py-1.5 bg-orange-100 text-orange-800 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors duration-200">
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Book Details */}
            <div className="bg-white rounded-lg p-2">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Book Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-600">Pages:</span>
                  <span className="ml-2 text-gray-900">{book.pages}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Format:</span>
                  <span className="ml-2 text-gray-900">{book.format}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Published:</span>
                  <span className="ml-2 text-gray-900">{book.published}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Publisher:</span>
                  <span className="ml-2 text-gray-900">{book.publisher}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">ISBN:</span>
                  <span className="ml-2 text-gray-900">{book.isbn}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Language:</span>
                  <span className="ml-2 text-gray-900">{book.language}</span>
                </div>
              </div>
            </div>

            {/* About the Author */}
            <div className="bg-white rounded-lg p-2">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">About the author</h3>
              
              <div className="flex items-start space-x-4 mb-6">
                {/* Author Avatar */}
                <div className="flex-shrink-0">
                  <img
                    src={book.authorInfo.avatar}
                    alt={book.authorInfo.name}
                    className="w-16 h-16 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(book.authorInfo.name)}&background=f97316&color=ffffff&size=64`;
                    }}
                  />
                </div>

                {/* Author Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{book.authorInfo.name}</h4>
                    {book.authorInfo.isVerified && (
                      <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span>{book.authorInfo.booksCount} books</span>
                    <span>•</span>
                    <span>{book.authorInfo.followersCount.toLocaleString()} followers</span>
                  </div>
                </div>

                {/* Follow Button */}
                <div className="flex-shrink-0">
                  <button
                    onClick={handleFollowAuthor}
                    className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
                      isFollowingAuthor
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {isFollowingAuthor ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>

              {/* Author Bio */}
              <div className="text-gray-700 leading-relaxed space-y-4">
                {book.authorInfo.bio.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Author Action Buttons */}
              <div className="flex items-center space-x-4 mt-6 pt-4 border-t border-gray-200">
                <button className="text-orange-600 hover:text-orange-700 font-medium hover:underline">
                  View all books by {book.authorInfo.name}
                </button>
                <span className="text-gray-300">•</span>
                <button className="text-orange-600 hover:text-orange-700 font-medium hover:underline">
                  Ask the Author
                </button>
              </div>
            </div>

            {/* Sample Reviews */}
            <div className="bg-white rounded-lg p-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Community Reviews</h3>
                <button className="text-orange-600 hover:text-orange-700 font-medium hover:underline">
                  Write a Review
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      S
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <button className="font-medium text-gray-900 hover:text-orange-600">Sarah Johnson</button>
                        <div className="flex text-orange-400">★★★★★</div>
                        <span className="text-gray-500 text-sm">March 15, 2024</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">Absolutely gripping from start to finish! The character development is fantastic and the zombie apocalypse feels terrifyingly real.</p>
                      <div className="flex items-center space-x-4 mt-3">
                        <button className="text-gray-500 hover:text-gray-700 text-sm">Reply</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      M
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <button className="font-medium text-gray-900 hover:text-orange-600">Mike Chen</button>
                        <div className="flex text-orange-400">★★★★☆</div>
                        <span className="text-gray-500 text-sm">February 28, 2024</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">Great start to the series. The relationship between Katie and Jenni is the heart of the story.</p>
                      <div className="flex items-center space-x-4 mt-3">
                        <button className="text-gray-500 hover:text-gray-700 text-sm">Reply</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button className="mt-6 w-full border border-gray-300 hover:bg-gray-50 py-3 px-4 rounded-lg transition-colors duration-200 font-medium">
                Show All {book.ratingCount.toLocaleString()} Reviews
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    
  );
}

export default BookDetail;