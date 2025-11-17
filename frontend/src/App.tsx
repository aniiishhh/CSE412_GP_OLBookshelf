import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SimpleAuthProvider } from './contexts/SimpleAuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SimpleProtectedRoute } from './components/SimpleProtectedRoute';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ReadingListPage from './pages/ReadingListPage';

function App() {
  return (
    <ThemeProvider>
      <SimpleAuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-bookshelf-light-bg dark:bg-bookshelf-dark-bg">
            <Navbar />
            
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<BooksPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route 
                  path="/profile" 
                  element={
                    <SimpleProtectedRoute>
                      <ProfilePage />
                    </SimpleProtectedRoute>
                  } 
                />
                <Route 
                  path="/reading-list" 
                  element={
                    <SimpleProtectedRoute>
                      <ReadingListPage />
                    </SimpleProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </Router>
      </SimpleAuthProvider>
    </ThemeProvider>
  );
}

export default App;