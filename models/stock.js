const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
	stock: { type: String },
	likes: { type: Number, default: 0 },
});

module.exports = mongoose.model('Stock', stockSchema);
