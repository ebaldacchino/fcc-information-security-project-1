const mongoose = require('mongoose');

mongoose
	.connect(
		process.env.DB,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
		console.log('Database connected successfully')
	)
	.catch((err) => console.log('Database connected unsuccessfully'));
