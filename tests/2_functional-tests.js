const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let like;

suite('Functional Tests', function () {
	test('Viewing one stock: GET request to /api/stock-prices/', (done) => {
		chai
			.request(server)
			.get('/api/stock-prices?stock=goog')
			.end((err, res) => {
				assert.equal(res.status, 200);
				const { stock, price, likes } = res.body.stockData;
				assert.equal(stock, 'GOOG');
				assert.isDefined(price);
				assert.isDefined(likes);
			});
		done();
	});
	test('Viewing one stock and liking it: GET request to /api/stock-prices/', (done) => {
		chai
			.request(server)
			.get('/api/stock-prices?stock=goog&like=true')
			.end((err, res) => {
				assert.equal(res.status, 200);
				const { stock, price, likes } = res.body.stockData;
				assert.equal(stock, 'GOOG');
				assert.isDefined(price);
				assert.isDefined(likes);
				like = likes;
				done();
			});
	});
	test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', (done) => {
		chai
			.request(server)
			.get('/api/stock-prices?stock=goog&like=true')
			.end((err, res) => {
				assert.equal(res.status, 200);
				const { stock, price, likes } = res.body.stockData;
				assert.equal(stock, 'GOOG');
				assert.isDefined(price);
				assert.equal(likes, like + 1);
			});
		done();
	});
	test('Viewing two stocks: GET request to /api/stock-prices/', (done) => {
		chai
			.request(server)
			.get('/api/stock-prices?stock=goog&stock=msft')
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isArray(res.body.stockData);
			});
		done();
	});
	test('Viewing two stocks and liking them: GET request to /api/stock-prices/', (done) => {
		chai
			.request(server)
			.get('/api/stock-prices?stock=goog&stock=msft&like=true')
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isArray(res.body.stockData);
			});
		done();
	});
});
