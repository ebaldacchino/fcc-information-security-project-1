const axios = require('axios');
const Stock = require('../models/stock');

const findStock = async (stock, add) => {
	let stockData = await Stock.findOne({ stock: stock.toUpperCase() });
	if (!stockData) {
		try {
			stockData = new Stock({
				stock: stock.toUpperCase(),
				likes: add ? 1 : 0,
			});
			await stockData.save();
		} catch (err) {
			console.log('error');
		}
	} else {
		if (add) {
			stockData.likes++;
			await stockData.save();
		}
	}
	return stockData;
};

const getStocks = async (req, res) => {
	const { stock, like } = req.query;
	let stockData;
	if (Array.isArray(stock)) {
		stockData = [];
		for (let i = 0; i < stock.length; i++) {
			try {
				const price = await getStock(stock[i]);
				const db = await findStock(stock[i], like);

				stockData = [
					...stockData,
					{
						stock: db.stock,
						price,
						likes: db.likes,
					},
				];
			} catch (err) {
				console.log('error');
			}
		}
		const relLikes = Object.values(stockData.map(({ likes }) => likes));
		const rel_likes = relLikes[0] - relLikes[1];
		stockData = [
			{
				...stockData[0],
				rel_likes,
			},
			{
				...stockData[1],
				rel_likes: rel_likes * -1,
			},
		];
		stockData.map((stock) => {
			delete stock.likes;
			return stock;
		});
	} else {
		const price = await getStock(stock);

		const db = await findStock(stock, like);
		stockData = {
			stock: db.stock,
			price,
			likes: db.likes,
		};
	}

	return res.status(200).json({
		stockData,
	});
};

const getStock = async (stock) => {
	const url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`;
	try {
		const { data } = await axios(url);
		return data.latestPrice;
	} catch (error) {
		return {
			error,
		};
	}
};

const deleteDatabase = (req, res) => {
	const data = Stock.remove(); 
	return res.status(200).json({
		database: 'Cleared',
	});
};
module.exports = { getStocks, deleteDatabase };
