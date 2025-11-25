import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8000';

interface User {
  userid: number;
  email: string;
  displayname: string;
}

interface Book {
  bookid: number;
  title: string;
  imageurl: string | null;
  averagerating: number | null;
  authors: Array<{ name: string }>;
  genres: Array<{ name: string }>;
  description?: string;
  pages?: number;
  isbn?: string;
  goodreadslink?: string;
}

interface Author {
  authorid: number;
  name: string;
}

interface Genre {
  genreid: number;
  name: string;
}

interface ReadingListItem {
  userid: number;
  bookid: number;
  status: 'want' | 'reading' | 'completed' | 'dropped';
  progresspages: number | null;
  userrating: number | null;
  note: string | null;
  addedat: string;
  book: Book;
}

const NAVBAR_STYLE = {
  position: 'sticky' as const,
  top: 0,
  zIndex: 1000,
  background: 'linear-gradient(135deg, #0f172a 0%, #1f2937 100%)',
  color: 'white',
  boxShadow: '0 6px 20px rgba(10, 10, 10, 0.35)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
};

function App() {
  const [currentView, setCurrentView] = useState<'login' | 'signup' | 'home' | 'bookDetails' | 'readingList'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [readingListItems, setReadingListItems] = useState<ReadingListItem[]>([]);
  const [bookInReadingList, setBookInReadingList] = useState<ReadingListItem | null>(null);
  const [readingStatus, setReadingStatus] = useState<ReadingListItem["status"]>("want");
  const [readingProgress, setReadingProgress] = useState<string>("");
  const [readingRating, setReadingRating] = useState<string>("");
  const [readingNote, setReadingNote] = useState<string>("");
  const [isSavingReadingList, setIsSavingReadingList] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayname, setDisplayname] = useState('');

  // Book browsing states
  const [books, setBooks] = useState<Book[]>([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingBooks, setLoadingBooks] = useState(false);

  // Filter states
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(5);
  
  // Available filters - now dynamically loaded based on search
  const [filteredAuthors, setFilteredAuthors] = useState<Author[]>([]);
  const [filteredGenres, setFilteredGenres] = useState<Genre[]>([]);
  const [authorSearch, setAuthorSearch] = useState('');
  const [genreSearch, setGenreSearch] = useState('');
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);

  const BOOKS_PER_PAGE = 50;

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView('home');
    }
  }, []);

  // Load books when home page loads
  useEffect(() => {
    if (currentView === 'home' && user) {
      loadBooks();
    }
  }, [currentView, user]);

  useEffect(() => {
    if (currentView === 'readingList' && user) {
      loadReadingList();
    }
  }, [currentView, user]);

  // Search authors dynamically as user types
  useEffect(() => {
    const searchAuthors = async () => {
      if (authorSearch.trim().length > 0) {
        try {
          const response = await fetch(`${API_URL}/authors/?name=${encodeURIComponent(authorSearch.trim())}&limit=200`);
          if (response.ok) {
            const data = await response.json();
            setFilteredAuthors(data);
            setShowAuthorDropdown(true);
          }
        } catch (err) {
          console.error('Error searching authors:', err);
        }
      } else {
        setFilteredAuthors([]);
        setShowAuthorDropdown(false);
      }
    };

    const debounceTimer = setTimeout(searchAuthors, 300);
    return () => clearTimeout(debounceTimer);
  }, [authorSearch]);

  // Search genres dynamically as user types
  useEffect(() => {
    const searchGenres = async () => {
      if (genreSearch.trim().length > 0) {
        try {
          const response = await fetch(`${API_URL}/genres/?name=${encodeURIComponent(genreSearch.trim())}&limit=200`);
          if (response.ok) {
            const data = await response.json();
            setFilteredGenres(data);
            setShowGenreDropdown(true);
          }
        } catch (err) {
          console.error('Error searching genres:', err);
        }
      } else {
        setFilteredGenres([]);
        setShowGenreDropdown(false);
      }
    };

    const debounceTimer = setTimeout(searchGenres, 300);
    return () => clearTimeout(debounceTimer);
  }, [genreSearch]);

  // Reload books when filters or page change
  useEffect(() => {
    if (currentView === 'home' && user) {
      loadBooks();
    }
  }, [currentPage, selectedAuthors, selectedGenres, minRating, maxRating]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowAuthorDropdown(false);
      setShowGenreDropdown(false);
    };
    
    if (showAuthorDropdown || showGenreDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showAuthorDropdown, showGenreDropdown]);

  // Check if book is in reading list when viewing details
  useEffect(() => {
    if (currentView === 'bookDetails' && selectedBook && user) {
      console.log('Checking book in reading list:', selectedBook.bookid);
      checkBookInReadingList(selectedBook.bookid);
    }
  }, [currentView, selectedBook, user]);

  // Debug logging
  useEffect(() => {
    console.log('Current view:', currentView);
    console.log('Selected book:', selectedBook);
    console.log('User:', user);
  }, [currentView, selectedBook, user]);

  useEffect(() => {
    if (bookInReadingList) {
      setReadingStatus(bookInReadingList.status);
      setReadingProgress(
        bookInReadingList.progresspages !== null && bookInReadingList.progresspages !== undefined
          ? String(bookInReadingList.progresspages)
          : ""
      );
      setReadingRating(
        bookInReadingList.userrating !== null && bookInReadingList.userrating !== undefined
          ? String(bookInReadingList.userrating)
          : ""
      );
      setReadingNote(bookInReadingList.note || "");
    } else {
      setReadingStatus("want");
      setReadingProgress("");
      setReadingRating("");
      setReadingNote("");
    }
  }, [bookInReadingList]);

  const loadBooks = async () => {
    setLoadingBooks(true);
    try {
      const skip = (currentPage - 1) * BOOKS_PER_PAGE;
      const params = new URLSearchParams({
        skip: skip.toString(),
        limit: BOOKS_PER_PAGE.toString(),
      });

      if (searchTitle) params.append('title', searchTitle);
      if (minRating > 0) params.append('min_rating', minRating.toString());
      if (maxRating < 5) params.append('max_rating', maxRating.toString());
      selectedAuthors.forEach(author => params.append('author', author));
      selectedGenres.forEach(genre => params.append('genre', genre));

      const response = await fetch(`${API_URL}/books?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setBooks(data.items);
        setTotalBooks(data.total);
        setTotalPages(data.pages);
      }
    } catch (err) {
      console.error('Error loading books:', err);
    } finally {
      setLoadingBooks(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      setCurrentView('home');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          displayname,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      setSuccess('Registration successful! Please log in.');
      setEmail('');
      setPassword('');
      setDisplayname('');
      
      setTimeout(() => {
        setCurrentView('login');
        setSuccess('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('login');
    setBooks([]);
    setSelectedAuthors([]);
    setSelectedGenres([]);
    setSearchTitle('');
    setMinRating(0);
    setMaxRating(5);
    setCurrentPage(1);
    setReadingListItems([]);
    setBookInReadingList(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadBooks();
  };

  const addAuthor = (authorName: string) => {
    if (!selectedAuthors.includes(authorName)) {
      setSelectedAuthors(prev => [...prev, authorName]);
      setCurrentPage(1);
    }
    setAuthorSearch('');
    setShowAuthorDropdown(false);
  };

  const removeAuthor = (authorName: string) => {
    setSelectedAuthors(prev => prev.filter(a => a !== authorName));
    setCurrentPage(1);
  };

  const addGenre = (genreName: string) => {
    if (!selectedGenres.includes(genreName)) {
      setSelectedGenres(prev => [...prev, genreName]);
      setCurrentPage(1);
    }
    setGenreSearch('');
    setShowGenreDropdown(false);
  };

  const removeGenre = (genreName: string) => {
    setSelectedGenres(prev => prev.filter(g => g !== genreName));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTitle('');
    setSelectedAuthors([]);
    setSelectedGenres([]);
    setMinRating(0);
    setMaxRating(5);
    setCurrentPage(1);
  };

  // Reading List Functions
  const normalizeReadingListItem = (item: ReadingListItem): ReadingListItem => ({
    ...item,
    status: item.status.toLowerCase() as ReadingListItem["status"],
  });

  const loadReadingList = async () => {
    if (!user) return;
    try {
      setReadingListItems([]);
      const response = await fetch(`${API_URL}/readinglist/${user.userid}?limit=100`);
      if (response.ok) {
        const data = await response.json();
        setReadingListItems(data.map(normalizeReadingListItem));
      }
    } catch (err) {
      console.error('Error loading reading list:', err);
    }
  };

  const checkBookInReadingList = async (bookId: number) => {
    if (!user) return;
    try {
      const response = await fetch(`${API_URL}/readinglist/${user.userid}/${bookId}`);
      if (response.ok) {
        const data = await response.json();
        setBookInReadingList(normalizeReadingListItem(data));
      } else {
        setBookInReadingList(null);
      }
    } catch (err) {
      setBookInReadingList(null);
    }
  };

  const addToReadingList = async (bookId: number, status: string = 'want') => {
    if (!user) return;
    const normalizedStatus = status.toUpperCase();
    try {
      const response = await fetch(`${API_URL}/readinglist/?user_id=${user.userid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookid: bookId,
          status: normalizedStatus,
          progresspages: null,
          userrating: null,
          note: null
        })
      });
      if (response.ok) {
        const data = await response.json();
        const normalized = normalizeReadingListItem(data);
        setBookInReadingList(normalized);
        setReadingListItems(prev => {
          const exists = prev.some(item => item.bookid === bookId);
          return exists ? prev : [...prev, normalized];
        });
        alert('Book added to your reading list!');
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Failed to add book');
      }
    } catch (err) {
      console.error('Error adding to reading list:', err);
      alert('Failed to add book to reading list');
    }
  };

  const updateReadingListItem = async (bookId: number, updates: Partial<ReadingListItem>) => {
    if (!user) return;
    const payload = { ...updates } as any;
    if (payload.status) {
      payload.status = (payload.status as string).toUpperCase();
    }
    try {
      const response = await fetch(`${API_URL}/readinglist/${user.userid}/${bookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const data = await response.json();
        setBookInReadingList(normalizeReadingListItem(data));
        setReadingListItems(prev => 
          prev.map(item => item.bookid === bookId ? normalizeReadingListItem(data) : item)
        );
        alert('Reading list updated!');
      }
    } catch (err) {
      console.error('Error updating reading list:', err);
      alert('Failed to update reading list');
    }
  };

  const removeFromReadingList = async (bookId: number) => {
    if (!user) return;
    if (!confirm('Remove this book from your reading list?')) return;
    try {
      const response = await fetch(`${API_URL}/readinglist/${user.userid}/${bookId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setBookInReadingList(null);
        setReadingListItems(prev => prev.filter(item => item.bookid !== bookId));
        alert('Book removed from reading list');
      }
    } catch (err) {
      console.error('Error removing from reading list:', err);
      alert('Failed to remove book');
    }
  };

  const handleSaveReadingListChanges = async () => {
    if (!selectedBook) return;
    setIsSavingReadingList(true);
    const progressValue =
      readingProgress === ""
        ? null
        : Math.max(0, parseInt(readingProgress, 10));
    const updates: Partial<ReadingListItem> = {
      status: readingStatus,
      progresspages: progressValue,
      userrating: readingRating === "" ? null : parseFloat(readingRating),
      note: readingNote || null,
    };
    await updateReadingListItem(selectedBook.bookid, updates);
    setIsSavingReadingList(false);
  };


  const renderStars = (rating: number | null) => {
    if (!rating) return <span style={{ color: '#999' }}>No rating</span>;
    
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} style={{ color: '#ffc107' }}>★</span>);
    }
    if (hasHalf) {
      stars.push(<span key="half" style={{ color: '#ffc107' }}>☆</span>);
    }
    while (stars.length < 5) {
      stars.push(<span key={`empty-${stars.length}`} style={{ color: '#ddd' }}>★</span>);
    }
    
    return <div>{stars} <span style={{ fontSize: '14px', color: '#666' }}>({rating.toFixed(1)})</span></div>;
  };

  // Login View
  if (currentView === 'login' && !user) {
  return (
      <div className="container">
        <div className="card">
          <h2>Login to Online Bookshelf</h2>
          
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="text-center mt-3">
            <span>Don't have an account? </span>
            <span className="link" onClick={() => setCurrentView('signup')}>
              Sign up
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Signup View
  if (currentView === 'signup' && !user) {
    return (
      <div className="container">
        <div className="card">
          <h2>Create Account</h2>
          
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="displayname">Display Name</label>
              <input
                type="text"
                id="displayname"
                value={displayname}
                onChange={(e) => setDisplayname(e.target.value)}
                required
                placeholder="Enter your display name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                minLength={6}
              />
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
          
          <div className="text-center mt-3">
            <span>Already have an account? </span>
            <span className="link" onClick={() => setCurrentView('login')}>
              Login
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Home View (Book Browsing)
  if (currentView === 'home' && user) {
  return (
      <div>
        <nav className="navbar" style={NAVBAR_STYLE}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h1 style={{ cursor: 'pointer', margin: 0, color: 'white' }} onClick={() => setCurrentView('home')}>📚 Online Bookshelf</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setCurrentView('home')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  background: '#2e57d1',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Browse Books
              </button>
              <button
                onClick={() => setCurrentView('readingList')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Reading List
              </button>
              <span style={{ marginLeft: '10px', color: 'rgba(248,250,252,0.85)' }}>Welcome, {user.displayname || user.email}!</span>
              <button onClick={handleLogout} style={{ background: '#dc3545', color: 'white' }}>Logout</button>
            </div>
          </div>
        </nav>
        
        <div className="container">
          <div style={{ display: 'flex', gap: '20px' }}>
            {/* Sidebar Filters */}
            <div style={{ width: '250px', flexShrink: 0 }}>
              <div style={{ 
                background: 'white', 
                padding: '20px', 
                borderRadius: '8px', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                position: 'sticky',
                top: '20px'
              }}>
                <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Filters</h3>
                
                {/* Authors Filter */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Authors</label>
                  
                  {/* Selected Authors Tags */}
                  {selectedAuthors.length > 0 && (
                    <div style={{ marginBottom: '8px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {selectedAuthors.map(author => (
                        <span key={author} style={{
                          background: '#007bff',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}>
                          {author}
                          <span 
                            onClick={() => removeAuthor(author)}
                            style={{ cursor: 'pointer', fontWeight: 'bold' }}
                          >
                            ×
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Author Search */}
                  <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      placeholder="Type to search authors..."
                      value={authorSearch}
                      onChange={(e) => {
                        setAuthorSearch(e.target.value);
                        setShowAuthorDropdown(e.target.value.length > 0);
                      }}
                      onFocus={(e) => {
                        if (e.target.value.length > 0) {
                          setShowAuthorDropdown(true);
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (authorSearch.length > 0) {
                          setShowAuthorDropdown(true);
                        }
                      }}
                      style={{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                    
                    {/* Dropdown */}
                    {showAuthorDropdown && filteredAuthors.length > 0 && (
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          maxHeight: '200px',
                          overflowY: 'auto',
                          background: 'white',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          marginTop: '2px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          zIndex: 1000
                        }}>
                        {filteredAuthors.slice(0, 200).map(author => (
                          <div
                            key={author.authorid}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addAuthor(author.name);
                            }}
                            style={{
                              padding: '8px 12px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              borderBottom: '1px solid #f0f0f0',
                              background: selectedAuthors.includes(author.name) ? '#e3f2fd' : 'white'
                            }}
                            onMouseOver={(e) => {
                              if (!selectedAuthors.includes(author.name)) {
                                e.currentTarget.style.background = '#f8f9fa';
                              }
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = selectedAuthors.includes(author.name) ? '#e3f2fd' : 'white';
                            }}
                          >
                            {author.name}
                            {selectedAuthors.includes(author.name) && <span style={{ float: 'right', color: '#007bff' }}>✓</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Genres Filter */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Genres</label>
                  
                  {/* Selected Genres Tags */}
                  {selectedGenres.length > 0 && (
                    <div style={{ marginBottom: '8px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {selectedGenres.map(genre => (
                        <span key={genre} style={{
                          background: '#28a745',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}>
                          {genre}
                          <span 
                            onClick={() => removeGenre(genre)}
                            style={{ cursor: 'pointer', fontWeight: 'bold' }}
                          >
                            ×
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Genre Search */}
                  <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      placeholder="Type to search genres..."
                      value={genreSearch}
                      onChange={(e) => {
                        setGenreSearch(e.target.value);
                        setShowGenreDropdown(e.target.value.length > 0);
                      }}
                      onFocus={(e) => {
                        if (e.target.value.length > 0) {
                          setShowGenreDropdown(true);
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (genreSearch.length > 0) {
                          setShowGenreDropdown(true);
                        }
                      }}
                      style={{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                    
                    {/* Dropdown */}
                    {showGenreDropdown && filteredGenres.length > 0 && (
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          maxHeight: '200px',
                          overflowY: 'auto',
                          background: 'white',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          marginTop: '2px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          zIndex: 1000
                        }}>
                        {filteredGenres.slice(0, 200).map(genre => (
                          <div
                            key={genre.genreid}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addGenre(genre.name);
                            }}
                            style={{
                              padding: '8px 12px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              borderBottom: '1px solid #f0f0f0',
                              background: selectedGenres.includes(genre.name) ? '#e8f5e9' : 'white'
                            }}
                            onMouseOver={(e) => {
                              if (!selectedGenres.includes(genre.name)) {
                                e.currentTarget.style.background = '#f8f9fa';
                              }
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = selectedGenres.includes(genre.name) ? '#e8f5e9' : 'white';
                            }}
                          >
                            {genre.name}
                            {selectedGenres.includes(genre.name) && <span style={{ float: 'right', color: '#28a745' }}>✓</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Rating Filter - Dual Range Slider */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
                    Rating: {minRating.toFixed(1)} - {maxRating.toFixed(1)} ★
                  </label>
                  
                  {/* Min Rating Slider */}
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ fontSize: '12px', color: '#666' }}>Min: {minRating.toFixed(1)}</label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.1"
                      value={minRating}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (val <= maxRating) {
                          setMinRating(val);
                          setCurrentPage(1);
                        }
                      }}
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                  </div>
                  
                  {/* Max Rating Slider */}
                  <div>
                    <label style={{ fontSize: '12px', color: '#666' }}>Max: {maxRating.toFixed(1)}</label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.1"
                      value={maxRating}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (val >= minRating) {
                          setMaxRating(val);
                          setCurrentPage(1);
                        }
                      }}
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                  </div>
                </div>

                <button 
                  onClick={clearFilters}
                  className="btn btn-secondary"
                  style={{ width: '100%', fontSize: '14px' }}
                >
                  Clear All Filters
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1 }}>
              {/* Search Bar - Sticky */}
              <div style={{ 
                position: 'sticky', 
                top: '70px',  /* Position below navbar */
                background: '#f4f4f4',
                paddingTop: '20px',
                paddingBottom: '15px',
                zIndex: 50,
                marginBottom: '20px',
                marginLeft: '-20px',
                marginRight: '-20px',
                paddingLeft: '20px',
                paddingRight: '20px'
              }}>
                <form onSubmit={handleSearch} style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder="Search books by title..."
                      value={searchTitle}
                      onChange={(e) => setSearchTitle(e.target.value)}
                      style={{ 
                        flex: 1, 
                        padding: '12px 16px', 
                        fontSize: '16px', 
                        borderRadius: '8px', 
                        border: '2px solid #ddd',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#007bff'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                    />
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        borderRadius: '8px',
                        fontWeight: '600'
                      }}
                    >
                      Search
                    </button>
                  </div>
                </form>

                {/* Results Info */}
                <div style={{ color: '#666', fontSize: '14px' }}>
                  {loadingBooks ? 'Loading...' : `Found ${totalBooks} books`}
                </div>
              </div>

              {/* Books Grid */}
              {loadingBooks ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>Loading books...</div>
              ) : books.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '8px' }}>
                  <h3>No books found</h3>
                  <p>Try adjusting your filters or search query</p>
                </div>
              ) : (
                <>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(5, 1fr)', 
                    gap: '20px',
                    marginBottom: '30px'
                  }}>
                    {books.map(book => (
                      <div 
                        key={book.bookid} 
                        onClick={() => {
                          setSelectedBook(book);
                          setCurrentView('bookDetails');
                        }}
                        style={{ 
                          background: 'white', 
                          borderRadius: '8px', 
                          overflow: 'hidden',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          cursor: 'pointer'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        }}
                      >
                        <div style={{ 
                          height: '200px', 
                          background: book.imageurl ? `url(${book.imageurl}) center/cover` : '#f0f0f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#999'
                        }}>
                          {!book.imageurl && '📖'}
                        </div>
                        <div style={{ padding: '12px' }}>
                          <h4 style={{ 
                            margin: '0 0 8px 0', 
                            fontSize: '14px',
                            height: '40px',
                            overflow: 'hidden',
                            lineHeight: '1.4'
                          }}>
                            {book.title}
                          </h4>
                          <p style={{ 
                            margin: '0 0 8px 0', 
                            fontSize: '12px', 
                            color: '#666',
                            height: '16px',
                            overflow: 'hidden'
                          }}>
                            {book.authors.map(a => a.name).join(', ')}
                          </p>
                          
                          {/* Genres */}
                          {book.genres && book.genres.length > 0 && (
                            <div style={{ marginBottom: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {book.genres.slice(0, 2).map((genre, idx) => (
                                <span 
                                  key={idx}
                                  style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '10px',
                                    fontWeight: '600'
                                  }}
                                >
                                  {genre.name}
                                </span>
                              ))}
                              {book.genres.length > 2 && (
                                <span style={{
                                  color: '#999',
                                  fontSize: '10px',
                                  padding: '2px 4px'
                                }}>
                                  +{book.genres.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                          
                          <div style={{ fontSize: '14px' }}>
                            {renderStars(book.averagerating)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '30px' }}>
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="btn btn-secondary"
                        style={{ padding: '8px 12px' }}
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 10) {
                          pageNum = i + 1;
                        } else if (currentPage <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 4) {
                          pageNum = totalPages - 9 + i;
                        } else {
                          pageNum = currentPage - 4 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className="btn"
                            style={{
                              padding: '8px 12px',
                              background: currentPage === pageNum ? '#007bff' : '#fff',
                              color: currentPage === pageNum ? '#fff' : '#333',
                              border: '1px solid #ddd'
                            }}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="btn btn-secondary"
                        style={{ padding: '8px 12px' }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Book Details View
  if (currentView === 'bookDetails' && selectedBook) {
    console.log('Rendering book details for:', selectedBook.title);
    console.log('Book in reading list:', bookInReadingList);
    
    try {
      return (
      <div>
        <nav className="navbar" style={NAVBAR_STYLE}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h1 style={{ cursor: 'pointer', margin: 0, color: 'white' }} onClick={() => setCurrentView('home')}>📚 Online Bookshelf</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setCurrentView('home')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  background: '#2e57d1',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Browse Books
              </button>
              <button
                onClick={() => setCurrentView('readingList')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Reading List
              </button>
              <span style={{ marginLeft: '10px', color: 'rgba(248,250,252,0.85)' }}>Welcome, {user?.displayname || user?.email}!</span>
              <button onClick={handleLogout} style={{ background: '#dc3545', color: 'white' }}>Logout</button>
      </div>
          </div>
        </nav>
        
        <div className="container" style={{ paddingTop: '30px', paddingBottom: '50px' }}>
          {/* Back Button */}
          <button 
            onClick={() => setCurrentView('home')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'white',
              border: '2px solid #007bff',
              color: '#007bff',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '20px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#007bff';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#007bff';
            }}
          >
            <span style={{ fontSize: '20px' }}>←</span>
            Back to Browse
        </button>
          
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', gap: '40px', padding: '40px' }}>
              {/* Book Cover */}
              <div style={{ flexShrink: 0 }}>
                {selectedBook.imageurl ? (
                  <img 
                    src={selectedBook.imageurl} 
                    alt={selectedBook.title}
                    style={{
                      width: '300px',
                      height: '450px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '300px',
                    height: '450px',
                    background: '#f0f0f0',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '64px',
                    color: '#999'
                  }}>
                    📖
                  </div>
                )}
              </div>
              
              {/* Book Details */}
              <div style={{ flex: 1 }}>
                <h1 style={{ 
                  margin: '0 0 15px 0', 
                  fontSize: '32px',
                  color: '#333',
                  lineHeight: '1.3'
                }}>
                  {selectedBook.title}
                </h1>
                
                {/* Authors */}
                <div style={{ marginBottom: '20px' }}>
                  <span style={{ fontSize: '18px', color: '#666', fontWeight: '500' }}>
                    by {selectedBook.authors.map(a => a.name).join(', ')}
                  </span>
                </div>
                
                {/* Rating */}
                <div style={{ marginBottom: '25px', fontSize: '18px' }}>
                  {renderStars(selectedBook.averagerating)}
                </div>
                
                {/* Genres */}
                {selectedBook.genres && selectedBook.genres.length > 0 && (
                  <div style={{ marginBottom: '25px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px', color: '#555' }}>
                      Genres
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {selectedBook.genres.map((genre, idx) => (
                        <span 
                          key={idx}
                          style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            padding: '6px 16px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Reading List Management */}
                <div style={{ 
                  marginTop: '30px', 
                  padding: '20px', 
                  background: '#f8f9fa', 
                  borderRadius: '8px',
                  border: '2px solid #e9ecef'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginTop: 0, marginBottom: '15px', color: '#333' }}>
                    📚 My Reading List
                  </h3>
                  
                  {!bookInReadingList ? (
                    <div>
                      <p style={{ marginBottom: '15px', color: '#666' }}>Add this book to your reading list:</p>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button onClick={() => addToReadingList(selectedBook.bookid, 'want')} style={{ padding: '10px 20px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                          Want to Read
                        </button>
                        <button onClick={() => addToReadingList(selectedBook.bookid, 'reading')} style={{ padding: '10px 20px', background: '#ffc107', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                          Currently Reading
                        </button>
                        <button onClick={() => addToReadingList(selectedBook.bookid, 'completed')} style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                          Completed
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#555' }}>Status:</label>
                        <select 
                          value={readingStatus}
                          onChange={(e) => {
                            const value = e.target.value as ReadingListItem["status"];
                            setReadingStatus(value);
                          }}
                          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', width: '200px' }}
                        >
                          <option value="want">Want to Read</option>
                          <option value="reading">Currently Reading</option>
                          <option value="completed">Completed</option>
                          <option value="dropped">Dropped</option>
                        </select>
                      </div>
                      
                      {selectedBook.pages && (
                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#555' }}>
                            Progress: {readingProgress || 0} / {selectedBook.pages} pages
                          </label>
                          <input 
                            type="number"
                            min="0"
                            max={selectedBook.pages}
                            value={readingProgress}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || /^\d+$/.test(value)) {
                                setReadingProgress(value);
                              }
                            }}
                            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', width: '120px' }}
                          />
                        </div>
                      )}
                      
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#555' }}>Your Rating:</label>
                        <select 
                          value={readingRating}
                          onChange={(e) => {
                            const value = e.target.value;
                            setReadingRating(value);
                          }}
                          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', width: '150px' }}
                        >
                          <option value="">No rating</option>
                          <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                          <option value="4">⭐⭐⭐⭐ (4)</option>
                          <option value="3">⭐⭐⭐ (3)</option>
                          <option value="2">⭐⭐ (2)</option>
                          <option value="1">⭐ (1)</option>
                        </select>
                      </div>
                      
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#555' }}>Notes:</label>
                        <textarea 
                          value={readingNote}
                          onChange={(e) => setReadingNote(e.target.value)}
                          placeholder="Add your thoughts about this book..."
                          style={{ 
                            padding: '10px', 
                            borderRadius: '6px', 
                            border: '1px solid #ddd', 
                            fontSize: '14px', 
                            width: '100%',
                            minHeight: '80px',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                          }}
                        />
                      </div>
                      
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                          onClick={handleSaveReadingListChanges}
                          disabled={isSavingReadingList}
                          style={{
                            padding: '10px 20px',
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            opacity: isSavingReadingList ? 0.7 : 1,
                          }}
                        >
                          {isSavingReadingList ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button 
                        onClick={() => removeFromReadingList(selectedBook.bookid)}
                        style={{ 
                          padding: '10px 20px', 
                          background: '#dc3545', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '6px', 
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                        >
                          Remove from Reading List
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Pages */}
                {selectedBook.pages && (
                  <div style={{ marginTop: '20px', marginBottom: '15px' }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>
                      <strong>Pages:</strong> {selectedBook.pages}
                    </span>
                  </div>
                )}
                
                {/* ISBN */}
                {selectedBook.isbn && (
                  <div style={{ marginBottom: '15px' }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>
                      <strong>ISBN:</strong> {selectedBook.isbn}
                    </span>
                  </div>
                )}
                
                {/* Description */}
                {selectedBook.description && (
                  <div style={{ marginTop: '30px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#333' }}>
                      Description
                    </h3>
                    <p style={{ 
                      fontSize: '15px', 
                      lineHeight: '1.7', 
                      color: '#555',
                      textAlign: 'justify'
                    }}>
                      {selectedBook.description}
        </p>
      </div>
                )}
                
                {/* Goodreads Link */}
                {selectedBook.goodreadslink && (
                  <div style={{ marginTop: '30px' }}>
                    <a 
                      href={selectedBook.goodreadslink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        background: '#553b08',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '16px',
                        fontWeight: '600',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#3d2a06'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#553b08'}
                    >
                      View on Goodreads →
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      );
    } catch (error) {
      console.error('Error rendering book details:', error);
      return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <h2>Error loading book details</h2>
          <p>{String(error)}</p>
          <button onClick={() => setCurrentView('home')}>Back to Browse</button>
        </div>
      );
    }
  }

  // My Reading List View
  if (currentView === 'readingList' && user) {
    console.log('Rendering reading list, items:', readingListItems.length);
    
    try {
      return (
        <div>
        <nav className="navbar" style={NAVBAR_STYLE}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h1 style={{ cursor: 'pointer', margin: 0 }} onClick={() => setCurrentView('home')}>📚 Online Bookshelf</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setCurrentView('home')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  background: '#2e57d1',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Browse Books
              </button>
              <button
                onClick={() => setCurrentView('readingList')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Reading List
              </button>
              <span style={{ marginLeft: '10px', color: 'rgba(248,250,252,0.85)' }}>Welcome, {user.displayname || user.email}!</span>
              <button onClick={handleLogout} style={{ background: '#dc3545', color: 'white' }}>Logout</button>
            </div>
          </div>
        </nav>
        
        <div className="container" style={{ paddingTop: '30px', paddingBottom: '50px' }}>
          <button 
            onClick={() => setCurrentView('home')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'white',
              border: '2px solid #007bff',
              color: '#007bff',
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '15px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#007bff';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#007bff';
            }}
          >
            <span style={{ fontSize: '18px' }}>←</span>
            Back to Browse
          </button>
          <h2 style={{ marginBottom: '25px', fontSize: '32px', color: '#333' }}>📚 My Reading List</h2>
          
          {/* Filter by status */}
          <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => loadReadingList()} style={{ padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              All ({readingListItems.length})
            </button>
            <button onClick={() => loadReadingList()} style={{ padding: '8px 16px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Want to Read ({readingListItems.filter(i => i.status === 'want').length})
            </button>
            <button onClick={() => loadReadingList()} style={{ padding: '8px 16px', background: '#ffc107', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Reading ({readingListItems.filter(i => i.status === 'reading').length})
            </button>
            <button onClick={() => loadReadingList()} style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Completed ({readingListItems.filter(i => i.status === 'completed').length})
            </button>
            <button onClick={() => loadReadingList()} style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Dropped ({readingListItems.filter(i => i.status === 'dropped').length})
            </button>
          </div>
          
          {readingListItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '24px', color: '#666', marginBottom: '15px' }}>Your reading list is empty</h3>
              <p style={{ color: '#999', marginBottom: '25px' }}>Start adding books to track your reading journey!</p>
              <button 
                onClick={() => setCurrentView('home')}
                style={{ 
                  padding: '12px 24px', 
                  background: '#007bff', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Browse Books
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {readingListItems.map(item => (
                <div 
                  key={item.bookid}
                  onClick={() => {
                    setSelectedBook(item.book);
                    setCurrentView('bookDetails');
                  }}
                  style={{ 
                    background: 'white', 
                    borderRadius: '12px', 
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  {item.book.imageurl ? (
                    <img 
                      src={item.book.imageurl} 
                      alt={item.book.title}
                      style={{ width: '100%', height: '350px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '350px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
                      📖
                    </div>
                  )}
                  
                  <div style={{ padding: '15px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#333', height: '48px', overflow: 'hidden', lineHeight: '1.5' }}>
                      {item.book.title}
                    </h3>
                    <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666', height: '20px', overflow: 'hidden' }}>
                      {item.book.authors.map(a => a.name).join(', ')}
                    </p>
                    
                    {/* Status Badge */}
                    <div style={{ marginBottom: '10px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: 
                          item.status === 'want' ? '#17a2b8' :
                          item.status === 'reading' ? '#ffc107' :
                          item.status === 'completed' ? '#28a745' : '#dc3545',
                        color: item.status === 'reading' ? '#333' : 'white'
                      }}>
                        {item.status === 'want' ? 'Want to Read' :
                         item.status === 'reading' ? 'Reading' :
                         item.status === 'completed' ? 'Completed' : 'Dropped'}
                      </span>
                    </div>
                    
                    {/* Progress */}
                    {item.progresspages && item.book.pages && (
                      <div style={{ marginBottom: '8px', fontSize: '13px', color: '#666' }}>
                        Progress: {item.progresspages} / {item.book.pages} pages
                        <div style={{ 
                          marginTop: '5px',
                          height: '6px', 
                          background: '#e9ecef', 
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{ 
                            height: '100%', 
                            background: '#28a745',
                            width: `${(item.progresspages / item.book.pages) * 100}%`,
                            transition: 'width 0.3s'
                          }} />
                        </div>
                      </div>
                    )}
                    
                    {/* User Rating */}
                    {item.userrating && (
                      <div style={{ fontSize: '14px', color: '#ffc107' }}>
                        {'⭐'.repeat(Math.round(item.userrating))} ({item.userrating})
                      </div>
                    )}
                    
                    {/* Note Preview */}
                    {item.note && (
                      <div style={{ 
                        marginTop: '10px', 
                        padding: '8px', 
                        background: '#f8f9fa', 
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#666',
                        fontStyle: 'italic',
                        maxHeight: '40px',
                        overflow: 'hidden'
                      }}>
                        "{item.note}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      );
    } catch (error) {
      console.error('Error rendering reading list:', error);
      return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <h2>Error loading reading list</h2>
          <p>{String(error)}</p>
          <button onClick={() => setCurrentView('home')}>Back to Browse</button>
        </div>
      );
    }
  }

  return null;
}

export default App;
