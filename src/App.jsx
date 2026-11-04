import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { BookProvider } from './context/BookContext';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { ExploreBooks } from './pages/ExploreBooks';
import { BookDetails } from './pages/BookDetails';
import { DonateBook } from './pages/DonateBook';
import { SellBook } from './pages/SellBook';
import { Dashboard } from './pages/Dashboard';
import { MyBookshelf } from './pages/MyBookshelf';
import { Requests } from './pages/Requests';
import { Negotiations } from './pages/Negotiations';
import { Wishlist } from './pages/Wishlist';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';

// Helper component to scroll to top on route navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <ToastProvider>
        <AuthProvider>
          <BookProvider>
            <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/explore" element={<ExploreBooks />} />
                  <Route path="/book/:id" element={<BookDetails />} />
                  <Route path="/donate" element={<DonateBook />} />
                  <Route path="/sell" element={<SellBook />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/bookshelf" element={<MyBookshelf />} />
                  <Route path="/requests" element={<Requests />} />
                  <Route path="/negotiations" element={<Negotiations />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BookProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;

