module.exports = function (app) {
  app.get('/', (req, res) => {
    res.render('index');
  });

  app.get('/about', (req, res) => {
    res.render('about');
  });

  app.get('/projects', (req, res) => {
    res.render('projects');
  });

  //The 404 Route (ALWAYS Keep this as the last route)
  app.get('*', (req, res) => {
    res.status(404).render('page-not-found');
  });

  /*
    My Domain provider redirects to defaultsite
    when accessing the http site.
    This will redirect back to home page.  
  */
  app.get('/defaultsite', (req, res) => {
    res.redirect('/');
  });
}