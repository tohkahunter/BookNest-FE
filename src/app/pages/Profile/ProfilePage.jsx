import React, { useState } from 'react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('currently-reading');
  
  const userData = {
    name: "Trịnh Tiến",
    location: "Da Nang, 78", 
    joined: "Joined in June 2025",
    ratings: 0,
    reviews: 0,
    photos: "https://s.gr-assets.com/assets/nophoto/user/u_225x300-c928cbb998d4ac6dd1f0f66f31f74b81.png",
    averageRating: "0.0",
    bookshelves: {
      'to-read': 2,
      'currently-reading': 1,
      'read': 1
    }
  };

  const [currentlyReading, setCurrentlyReading] = useState({
    title: "Never Flinch (Holly Gibney, #4)",
    author: "Stephen King",
    authorType: "Goodreads Author",
    bookshelf: "currently-reading",
    timeAgo: "0 minutes ago",
    cover: "https://product.hstatic.net/200000301138/product/71418a942cd3034cb029ee888374a583_8da6b5ef2a094805ad5ceba1f30ec828.jpg",
    status: "Currently Reading"
  });

  const [recentUpdates, setRecentUpdates] = useState([
    {
      id: 1,
      action: "finished reading",
      title: "The Retirement Plan",
      author: "Sue Hincenbergs",
      authorType: "Goodreads Author",
      timeAgo: "0 minutes ago",
      status: "Read",
      cover: "https://product.hstatic.net/200000301138/product/71418a942cd3034cb029ee888374a583_8da6b5ef2a094805ad5ceba1f30ec828.jpg"
    },
    {
      id: 2,
      action: "started reading",
      title: "Never Flinch (Holly Gibney, #4)",
      author: "Stephen King",
      authorType: "Goodreads Author", 
      timeAgo: "0 minutes ago",
      status: "Currently Reading",
      cover: "https://product.hstatic.net/200000301138/product/71418a942cd3034cb029ee888374a583_8da6b5ef2a094805ad5ceba1f30ec828.jpg"
    },
    {
      id: 3,
      action: "wants to read",
      title: "The God of the Garden: Thoughts on Creation, Culture, and the Kingdom",
      author: "Andrew Peterson",
      authorType: "Goodreads Author",
      timeAgo: "1 minute ago",
      status: "Want to Read",
      cover: "https://product.hstatic.net/200000301138/product/71418a942cd3034cb029ee888374a583_8da6b5ef2a094805ad5ceba1f30ec828.jpg"
    },
    {
      id: 4,
      action: "wants to read",
      title: "Another Gospel?: A Lifelong Christian Seeks Truth in Response to Progressive Christianity",
      author: "Alisa Childers",
      authorType: "",
      timeAgo: "1 minute ago", 
      status: "Want to Read",
      cover: "https://product.hstatic.net/200000301138/product/71418a942cd3034cb029ee888374a583_8da6b5ef2a094805ad5ceba1f30ec828.jpg"
    }
  ]);

  const statusOptions = [
    { value: "Want to Read", label: "Want to Read", color: "bg-blue-600 hover:bg-blue-700", icon: "📚" },
    { value: "Currently Reading", label: "Currently Reading", color: "bg-orange-500 hover:bg-orange-600", icon: "📖" },
    { value: "Read", label: "Read", color: "bg-green-600 hover:bg-green-700", icon: "✓" }
  ];

  const handleStatusChange = (bookId, newStatus, isCurrentReading = false) => {
    if (isCurrentReading) {
      setCurrentlyReading(prev => ({
        ...prev,
        status: newStatus,
        bookshelf: newStatus.toLowerCase().replace(' ', '-')
      }));
    } else {
      setRecentUpdates(prev => 
        prev.map(update => 
          update.id === bookId 
            ? { ...update, status: newStatus }
            : update
        )
      );
    }
  };

  const getStatusStyle = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'bg-gray-600 hover:bg-gray-700';
  };

  const getStatusIcon = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.icon : '';
  };

  const StarRating = ({ rating = 0, size = "sm" }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-gray-300 hover:text-yellow-400 cursor-pointer transition-colors ${size === 'sm' ? 'text-sm' : 'text-lg'}`}
        >
          ★
        </span>
      ))}
    </div>
  );

  const BookCover = ({ type = "default", title = "Book Cover", cover }) => {
    if (cover) {
      return (
        <img 
          src={cover}
          alt={title}
          className={`rounded-md border border-gray-200 object-cover ${
            type === 'large' ? 'w-20 h-28' : 'w-14 h-20'
          }`}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      );
    }

    const getBookColor = (title) => {
      const colors = [
        'from-red-100 to-red-200 bg-red-300',
        'from-blue-100 to-blue-200 bg-blue-300', 
        'from-green-100 to-green-200 bg-green-300',
        'from-purple-100 to-purple-200 bg-purple-300',
        'from-orange-100 to-orange-200 bg-orange-300'
      ];
      const index = title.length % colors.length;
      return colors[index];
    };

    const colorClass = getBookColor(title);
    const [gradientClass, bgClass] = colorClass.split(' bg-');
    
    return (
      <div className={`bg-gradient-to-br ${gradientClass} rounded-md flex items-center justify-center border ${
        type === 'large' ? 'w-20 h-28' : 'w-14 h-20'
      }`}>
        <div className={`bg-${bgClass} rounded flex items-center justify-center ${
          type === 'large' ? 'w-16 h-24' : 'w-10 h-16'
        }`}>
          <svg className={`text-white ${type === 'large' ? 'w-8 h-8' : 'w-5 h-5'}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        </div>
      </div>
    );
  };

  const StatusDropdown = ({ currentStatus, onStatusChange, bookId, isCurrentReading = false }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`btn btn-sm text-white border-0 min-w-[140px] text-left justify-between rounded-sm ${getStatusStyle(currentStatus)}`}
        >
        <span className="flex items-center justify-between min-w-[160px] max-w-[160px] gap-1">

      <span className="flex items-center gap-1">
        {getStatusIcon(currentStatus)} 
        {currentStatus === 'Currently Reading' ? 'Currently Rea...' : currentStatus}
      </span>
      <span className="ml-1">▼</span>
    </span>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[180px]">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onStatusChange(bookId, option.value, isCurrentReading);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2 ${
                  option.value === currentStatus ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                } ${option === statusOptions[0] ? 'rounded-t-lg' : ''} ${
                  option === statusOptions[statusOptions.length - 1] ? 'rounded-b-lg' : ''
                }`}
              >
                <span>{option.icon}</span>
                <span>{option.label}</span>
                {option.value === currentStatus && <span className="ml-auto text-blue-600">✓</span>}
              </button>
            ))}
          </div>
        )}

        {isOpen && (
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Profile Avatar */}
            <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center">
                <img src={userData.photos} />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 ">{userData.name}</h1>
                <button className="text-sm text-blue-600 hover:text-blue-800">(edit profile)</button>
              </div>
              
              <div className="grid grid-cols-6 gap-4 text-sm  ">
                <div>
                  <div className="text-gray-600 ">Details</div>
                  <div className="text-gray-800">{userData.location}</div>
                </div>
                <div>
                  <div className="text-gray-600">Activity</div>
                  <div className="text-gray-800">{userData.joined}</div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 text-sm text-left space-y-1">
                <div className="text-blue-600 hover:text-blue-800 cursor-pointer">
                  {userData.ratings} ratings ({userData.averageRating} avg)
                </div>
                <div className="text-blue-600 hover:text-blue-800 cursor-pointer">
                  {userData.reviews} reviews
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bookshelves Section */}
        <div className="bg-white rounded-lg p-6 mb-px">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wide">
            {userData.name.toUpperCase()}'S BOOKSHELVES
          </h2>
          
          <div className="flex flex-wrap gap-6 mb-4">
            <button 
              className={`text-blue-600 hover:text-blue-800 transition-colors ${
                activeTab === 'to-read' ? 'font-semibold border-b-2 border-blue-600' : ''
              }`}
              onClick={() => setActiveTab('to-read')}
            >
              to-read ({userData.bookshelves['to-read']})
            </button>
            <button 
              className={`text-blue-600 hover:text-blue-800 transition-colors ${
                activeTab === 'currently-reading' ? 'font-semibold border-b-2 border-blue-600' : ''
              }`}
              onClick={() => setActiveTab('currently-reading')}
            >
              currently-reading ({userData.bookshelves['currently-reading']})
            </button>
            <button 
              className={`text-blue-600 hover:text-blue-800 transition-colors ${
                activeTab === 'read' ? 'font-semibold border-b-2 border-blue-600' : ''
              }`}
              onClick={() => setActiveTab('read')}
            >
              read ({userData.bookshelves['read']})
            </button>
          </div>

          <div className="text-right">
            <button className="text-blue-600 hover:text-blue-800 text-sm transition-colors">
              Stats | More...
            </button>
          </div>
        </div>

        {/* Currently Reading Section */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wide border-b border-gray-200">
            TRINH IS CURRENTLY READING
          </h2>

          <div className="flex gap-4">
            <BookCover 
            type="large"
            title={currentlyReading.title} 
            cover={currentlyReading.cover}  />
            
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">
                Trịnh Tiến is currently reading
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {currentlyReading.title}
              </h3>
              
              <div className="text-sm text-gray-600 mb-2">
                by {currentlyReading.author} ({currentlyReading.authorType})
              </div>
              
              <div className="text-sm text-gray-600 mb-2">
                bookshelves: <span className="text-blue-600">{currentlyReading.bookshelf}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{currentlyReading.timeAgo}</span>
                <span>•</span>
                <button className="text-blue-600 hover:text-blue-800">comment</button>
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="flex flex-col gap-3 items-end">
              <StatusDropdown 
                currentStatus={currentlyReading.status}
                onStatusChange={handleStatusChange}
                bookId="current"
                isCurrentReading={true}
              />
              
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Rate this book</div>
                <StarRating size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Updates Section */}
        <div className="bg-white rounded-lg p-6">
          <div className="items-center pb-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wide border-b border-gray-200">
              {userData.name.toUpperCase()}'S RECENT UPDATES
            </h2>
          </div>

          <div className="space-y-8">
            {recentUpdates.map((update, index) => (
              <div key={update.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex gap-4">
                  <BookCover title={update.title} cover={update.cover} />
                  
                  <div className="flex-1">
                    <div className="text-sm text-gray-700 mb-2">
                      <strong>{userData.name}</strong> {update.action}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-800 cursor-pointer mb-2 transition-colors leading-tight">
                      {update.title}
                    </h3>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      by <span className="text-blue-600 hover:text-blue-800 cursor-pointer">{update.author}</span>
                      {update.authorType && <span className="text-gray-500"> ({update.authorType})</span>}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{update.timeAgo}</span>
                      <span>•</span>
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">like</button>
                      <span>•</span>
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">comment</button>
                      <button className="ml-auto text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex flex-col gap-3 items-end">
                    <StatusDropdown 
                      currentStatus={update.status}
                      onStatusChange={handleStatusChange}
                      bookId={update.id}
                    />
                    
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Rate this book</div>
                      <StarRating size="sm" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* More Link */}
            <div className="text-right mt-6">
              <button className="text-blue-600 hover:text-blue-800 text-sm transition-colors">
                More of {userData.name}'s books...
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;