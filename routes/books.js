const express = require('express');
const Book = require('../models/Book');
const Transaction = require('../models/Transaction');
const Member = require('../models/Member');
const router = express.Router();


router.get('/available', async (req, res) => {
  try {
    const books = await Book.find({ status: 'available' });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/add', async (req, res) => {
  try {
    const { title, author, ISBN } = req.body;

    const existingBook = await Book.findOne({ ISBN });
    if (existingBook) {
      return res.status(400).json({ message: 'A book with this ISBN already exists' });
    }

    const newBook = new Book({ title, author, ISBN });
    await newBook.save();
    res.json({ message: 'Book added successfully', book: newBook });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/delete/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn; 

  
    const result = await Book.deleteOne({ ISBN: isbn });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post('/issue/:isbn', async (req, res) => {
  try {
    const { isbn } = req.params; 
    const { mobile, borrower, dueDate } = req.body; 

    
    if (!mobile || !borrower || !dueDate) {
      return res.status(400).json({ message: 'Please provide all required fields: mobile, borrower, and dueDate.' });
    }

    
    const member = await Member.findOne({ mobile });

    if (!member) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    
    const book = await Book.findOne({ ISBN: isbn });

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
      dueDate: new Date(dueDate), 
    });

    await newTransaction.save();

    res.json({
      message: 'Book issued successfully',
      book,
      transaction: newTransaction,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post('/return', async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: 'Please provide mobile number.' });
    }

    const transaction = await Transaction.findOne({ mobile, returnDate: null });

    if (!transaction) {
      return res.status(404).json({ message: 'No issued book found for this mobile number.' });
    }

    const book = await Book.findById(transaction.bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found in the system.' });
    }

    book.status = 'available';
    book.borrower = null;
    await book.save();

    transaction.returnDate = new Date();
    await transaction.save();

    res.json({
      message: 'Book returned successfully',
      book,
      transaction,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/add', async (req, res) => {
  try {
    const { title, author, ISBN } = req.body;

    
    const existingBook = await Book.findOne({ ISBN });
    if (existingBook) {
      return res.status(400).json({ message: 'A book with this ISBN already exists' });
    }

    
    const newBook = new Book({
      title,
      author,
      ISBN,
      status: 'available',
      borrower: null, 
    });

    await newBook.save();
    res.json({ message: 'Book added successfully', book: newBook });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
