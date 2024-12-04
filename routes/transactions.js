const express = require('express');
const router = express.Router(); 
const Book = require('../models/Book'); 
const Transaction = require('../models/Transaction');


router.post('/issue', async (req, res) => {
  try {
    const { bookId, mobile, borrower, dueDate } = req.body;

    
    if (!bookId || !mobile || !borrower || !dueDate) {
      return res.status(400).json({ message: 'Please provide all required fields: bookId, mobile, borrower, and dueDate.' });
    }

    
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    if (book.status !== 'available') {
      return res.status(400).json({ message: 'Book is already issued.' });
    }

    
    book.status = 'issued';
    book.borrower = borrower;

    await book.save();

    
    const newTransaction = new Transaction({
      bookId: book._id,
      borrower: borrower,
      mobile: mobile,
      issueDate: new Date(),
      returnDate: null, 
      dueDate: dueDate,
    });

    await newTransaction.save();

    res.json({ message: 'Book issued successfully', book, transaction: newTransaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 
