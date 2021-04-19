'use strict';

const { getStocks, deleteDatabase } = require('../controllers/stocks');

module.exports = (app) => {
	app.route('/api/stock-prices').get(getStocks).delete(deleteDatabase);
};
