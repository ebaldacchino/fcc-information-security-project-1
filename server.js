'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');

const app = express();
require('./db');

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' })); //For FCC testing purposes only

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

//Index page (static HTML)
app.route('/').get((req, res) => {
	res.sendFile(process.cwd() + '/views/index.html');
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);

//404 Not Found Middleware
app.use((req, res, next) => {
	res.status(404).type('text').send('Not Found');
});

const port = process.env.PORT || 3000;
//Start our server and tests!
app.listen(port, () => {
	console.log('Listening on port ' + port);
	if (process.env.NODE_ENV === 'test') {
		console.log('Running Tests...');
		setTimeout(() => {
			try {
				runner.run();
			} catch (e) {
				var error = e;
				console.log('Tests are not valid:');
				console.log(error);
			}
		}, 3500);
	}
});

module.exports = app; //for testing
