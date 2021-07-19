const express = require('express');
const path = require('path');
const cons = require('consolidate');
const app = express();

// view engine setup
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

let wwwRedirect = function(req, res) {
	if(req.get('host').indexOf('www.') === 0){
		if(req.method === "GET" && !req.xhr){
			return res.redirect(req.protocol + '://' + req.get('host').substring(4) + req.originalUrl);
		}
	}
}

app.use(wwwRedirect);

app.use('/static', express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, function () {
	console.log('Server started.', server.address());
});

require('./app/routes')(app);
