const express = require('express');
const path = require('path');
const cons = require('consolidate');
const redirectSSL = require('redirect-ssl');
const app = express();

// view engine setup
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

if (process.env.NODE_ENV === 'production') {
	// If not local host use redirectSLL
	app.use(redirectSLL.create());
}

app.use('/static', express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, function () {
	console.log('Server started.', server.address());
});

require('./app/routes')(app);
