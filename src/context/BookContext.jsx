import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import {
  INITIAL_BOOKS,
  INITIAL_REQUESTS,
  INITIAL_NEGOTIATIONS,
  INITIAL_WISHLIST
} from '../utils/seedData';
import { generateId } from '../utils/helpers';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const BookContext = createContext(null);

export const BookProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  // Books State
  const [books, setBooks] = useState(() => {
    const saved = storage.get('books');
    if (saved && Array.isArray(saved) && saved.length > 0) return saved;
    storage.set('books', INITIAL_BOOKS);
    return INITIAL_BOOKS;
  });

  // Requests State
  const [requests, setRequests] = useState(() => {
    const saved = storage.get('requests');
    if (saved && Array.isArray(saved) && saved.length > 0) return saved;
    storage.set('requests', INITIAL_REQUESTS);
    return INITIAL_REQUESTS;
  });

  // Negotiations State
  const [negotiations, setNegotiations] = useState(() => {
    const saved = storage.get('negotiations');
    if (saved && Array.isArray(saved) && saved.length > 0) return saved;
    storage.set('negotiations', INITIAL_NEGOTIATIONS);
    return INITIAL_NEGOTIATIONS;
  });

  // Wishlist State (list of book IDs)
  const [wishlist, setWishlist] = useState(() => {
    const saved = storage.get('wishlist');
    if (saved && Array.isArray(saved)) return saved;
    storage.set('wishlist', INITIAL_WISHLIST);
    return INITIAL_WISHLIST;
  });

  // Sync with LocalStorage
  useEffect(() => {
    storage.set('books', books);
  }, [books]);

  useEffect(() => {
    storage.set('requests', requests);
  }, [requests]);

  useEffect(() => {
    storage.set('negotiations', negotiations);
  }, [negotiations]);

  useEffect(() => {
    storage.set('wishlist', wishlist);
  }, [wishlist]);

  // ==========================================
  // BOOK ACTIONS
  // ==========================================

  const addBook = (bookData) => {
    if (!currentUser) {
      showToast('Please log in to list a book', 'error');
      return null;
    }

    const newBook = {
      id: generateId('book'),
      title: bookData.title.trim(),
      author: bookData.author.trim(),
      category: bookData.category || 'General',
      condition: bookData.condition || 'Good',
      listingType: bookData.listingType, // 'donation', 'fixed', 'negotiable'
      price: bookData.listingType === 'donation' ? 0 : Number(bookData.price) || 0,
      description: bookData.description.trim(),
      coverImage: bookData.coverImage,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerCity: bookData.location || currentUser.city,
      status: 'Available',
      language: bookData.language || 'English',
      pages: Number(bookData.pages) || 250,
      publishedYear: Number(bookData.publishedYear) || new Date().getFullYear(),
      createdAt: new Date().toISOString(),
      featured: false
    };

    setBooks((prev) => [newBook, ...prev]);
    showToast(
      bookData.listingType === 'donation'
        ? 'Book listed for donation successfully!'
        : 'Book listed for sale successfully!',
      'success'
    );
    return newBook;
  };

  const updateBook = (bookId, updatedFields) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, ...updatedFields } : b))
    );
    showToast('Book details updated successfully', 'success');
  };

  const deleteBook = (bookId) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    // Also remove from wishlist
    setWishlist((prev) => prev.filter((id) => id !== bookId));
    showToast('Book removed from bookshelf', 'info');
  };

  const changeAvailability = (bookId, newStatus) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, status: newStatus } : b))
    );
    showToast(`Status updated to "${newStatus}"`, 'success');
  };

  // ==========================================
  // REQUEST ACTIONS (Donations & Purchases)
  // ==========================================

  const createRequest = ({ bookId, message }) => {
    if (!currentUser) {
      showToast('Please login to request this book', 'error');
      return { success: false };
    }

    const book = books.find((b) => b.id === bookId);
    if (!book) {
      showToast('Book not found', 'error');
      return { success: false };
    }

    if (book.ownerId === currentUser.id) {
      showToast('You cannot request your own book!', 'warning');
      return { success: false };
    }

    // Check if already requested and pending
    const existingReq = requests.find(
      (r) =>
        r.bookId === bookId &&
        r.buyerId === currentUser.id &&
        (r.status === 'Pending' || r.status === 'Accepted')
    );
    if (existingReq) {
      showToast('You already have an active request for this book', 'warning');
      return { success: false };
    }

    const newRequest = {
      id: generateId('req'),
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookCover: book.coverImage,
      listingType: book.listingType,
      price: book.price,
      sellerId: book.ownerId,
      sellerName: book.ownerName,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerEmail: currentUser.email,
      buyerCity: currentUser.city,
      message: message ? message.trim() : 'I am interested in this book!',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setRequests((prev) => [newRequest, ...prev]);
    showToast(
      book.listingType === 'donation'
        ? 'Book request sent to owner!'
        : 'Purchase request sent to seller!',
      'success'
    );
    return { success: true, request: newRequest };
  };

  const updateRequestStatus = (requestId, newStatus) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: newStatus, updatedAt: new Date().toISOString() }
          : r
      )
    );

    // If accepted, mark book as Reserved
    if (newStatus === 'Accepted') {
      changeAvailability(req.bookId, 'Reserved');
      showToast(`Request accepted! Book "${req.bookTitle}" is now Reserved.`, 'success');
    } else if (newStatus === 'Completed') {
      const finalStatus = req.listingType === 'donation' ? 'Donated' : 'Sold';
      changeAvailability(req.bookId, finalStatus);
      showToast(`Exchange marked as Completed! Book is marked as ${finalStatus}.`, 'success');
    } else if (newStatus === 'Rejected') {
      showToast('Request was rejected.', 'info');
    } else if (newStatus === 'Cancelled') {
      showToast('Request was cancelled.', 'info');
    }
  };

  const cancelRequest = (requestId) => {
    updateRequestStatus(requestId, 'Cancelled');
  };

  // ==========================================
  // PRICE NEGOTIATION SYSTEM
  // ==========================================

  const createOffer = ({ bookId, offerAmount, message }) => {
    if (!currentUser) {
      showToast('Please log in to make an offer', 'error');
      return { success: false };
    }

    const book = books.find((b) => b.id === bookId);
    if (!book) {
      showToast('Book not found', 'error');
      return { success: false };
    }

    if (book.ownerId === currentUser.id) {
      showToast('You cannot make an offer on your own book!', 'warning');
      return { success: false };
    }

    const numericOffer = Number(offerAmount);
    if (isNaN(numericOffer) || numericOffer <= 0) {
      showToast('Please enter a valid offer amount', 'error');
      return { success: false };
    }

    // Check if active negotiation already exists between this buyer and book
    const existing = negotiations.find(
      (n) => n.bookId === bookId && n.buyerId === currentUser.id && n.status === 'Pending'
    );
    if (existing) {
      showToast('You already have an active negotiation for this book. View Negotiations.', 'warning');
      return { success: false, existingId: existing.id };
    }

    const negotiationId = generateId('neg');
    const newNegotiation = {
      id: negotiationId,
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookCover: book.coverImage,
      listedPrice: book.price,
      sellerId: book.ownerId,
      sellerName: book.ownerName,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      currentOffer: numericOffer,
      lastOfferBy: 'buyer',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        {
          id: generateId('hist'),
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderRole: 'buyer',
          amount: numericOffer,
          message: message?.trim() || `Offered ₹${numericOffer} for "${book.title}"`,
          timestamp: new Date().toISOString()
        }
      ]
    };

    setNegotiations((prev) => [newNegotiation, ...prev]);
    showToast(`Offer of ₹${numericOffer} sent to seller!`, 'success');
    return { success: true, negotiation: newNegotiation };
  };

  const sendCounterOffer = ({ negotiationId, amount, message }) => {
    if (!currentUser) return;
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      showToast('Please enter a valid counteroffer amount', 'error');
      return;
    }

    const neg = negotiations.find((n) => n.id === negotiationId);
    if (!neg) return;

    const isSeller = neg.sellerId === currentUser.id;
    const role = isSeller ? 'seller' : 'buyer';

    const newHistoryItem = {
      id: generateId('hist'),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: role,
      amount: numericAmount,
      message: message?.trim() || `Counteroffered ₹${numericAmount}`,
      timestamp: new Date().toISOString()
    };

    setNegotiations((prev) =>
      prev.map((n) =>
        n.id === negotiationId
          ? {
              ...n,
              currentOffer: numericAmount,
              lastOfferBy: role,
              status: 'Pending',
              updatedAt: new Date().toISOString(),
              history: [...n.history, newHistoryItem]
            }
          : n
      )
    );

    showToast(`Counteroffer of ₹${numericAmount} sent!`, 'success');
  };

  const respondToOffer = ({ negotiationId, action }) => {
    if (!currentUser) return;
    const neg = negotiations.find((n) => n.id === negotiationId);
    if (!neg) return;

    if (action === 'accept') {
      setNegotiations((prev) =>
        prev.map((n) =>
          n.id === negotiationId
            ? { ...n, status: 'Accepted', updatedAt: new Date().toISOString() }
            : n
        )
      );
      // Mark book as Reserved
      changeAvailability(neg.bookId, 'Reserved');
      showToast(`Offer of ₹${neg.currentOffer} Accepted! Book is now Reserved.`, 'success');
    } else if (action === 'reject') {
      setNegotiations((prev) =>
        prev.map((n) =>
          n.id === negotiationId
            ? { ...n, status: 'Rejected', updatedAt: new Date().toISOString() }
            : n
        )
      );
      showToast('Offer has been rejected.', 'info');
    }
  };

  // ==========================================
  // WISHLIST ACTIONS
  // ==========================================

  const toggleWishlist = (bookId) => {
    if (wishlist.includes(bookId)) {
      setWishlist((prev) => prev.filter((id) => id !== bookId));
      showToast('Removed from wishlist', 'info');
    } else {
      setWishlist((prev) => [...prev, bookId]);
      showToast('Added to your wishlist!', 'success');
    }
  };

  const isWishlisted = (bookId) => {
    return wishlist.includes(bookId);
  };

  // Reset to seed demo state
  const resetToDemo = () => {
    storage.clearAll();
    setBooks(INITIAL_BOOKS);
    setRequests(INITIAL_REQUESTS);
    setNegotiations(INITIAL_NEGOTIATIONS);
    setWishlist(INITIAL_WISHLIST);
    showToast('Platform reset to initial demo data', 'info');
  };

  return (
    <BookContext.Provider
      value={{
        books,
        addBook,
        updateBook,
        deleteBook,
        changeAvailability,
        requests,
        createRequest,
        updateRequestStatus,
        cancelRequest,
        negotiations,
        createOffer,
        sendCounterOffer,
        respondToOffer,
        wishlist,
        toggleWishlist,
        isWishlisted,
        resetToDemo
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};

