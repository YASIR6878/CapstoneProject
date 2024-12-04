const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  borrower: { type: String, required: true },
  mobile: { type: String, required: true }, 
  issueDate: { type: Date, default: Date.now },
  returnDate: { type: Date },
  dueDate: { type: Date, required: true } 
});

module.exports = mongoose.model('Transaction', transactionSchema);
