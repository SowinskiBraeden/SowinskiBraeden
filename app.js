const express = require('express');
const secure = require('ssl-express-www');
const path = require('path');
const cons = require('consolidate');
const app = express();

// User ssl-express-www to redirect http to https
app.use(secure);

// view engine setup
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use('/static', express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, function () {
	console.log('Server started.', server.address());
});

require('./app/routes')(app);
