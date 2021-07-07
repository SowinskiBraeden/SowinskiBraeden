const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use('/static', express.static(path.join(__dirname, 'public')));

const PORT = 3000
const server = app.listen(PORT, function () {
	console.log('Server started.', server.address());
});

require('./app/routes')(app);
