module.exports = function (app) {
  app.get('/', function (req, res) {
    res.render('index');
  });
  app.get('/about', function (req, res) {
    res.render('about');
  });
  //The 404 Route (ALWAYS Keep this as the last route)
  app.get('*', function(req, res){
    res.status(404).render('page-not-found');
  });
}