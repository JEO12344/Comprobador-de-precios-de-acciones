const cors = require('cors');

module.exports = function (app) {
  
  app.route('/_api/server.js')
    .get(function(req, res, next) {
      console.log('requested');
      fs.readFile(__dirname + '/server.js', function(err, data) {
        if(err) return next(err);
        res.send(data.toString());
      });
    });
  app.route('/_api/routes/api.js')
    .get(function(req, res, next) {
      console.log('requested');
      fs.readFile(__dirname + '/routes/api.js', function(err, data) {
        if(err) return next(err);
        res.type('txt').send(data.toString());
      });
    });
  app.route('/_api/controllers/convertHandler.js')
    .get(function(req, res, next) {
      console.log('requested');
      fs.readFile(__dirname + '/controllers/convertHandler.js', function(err, data) {
        if(err) return next(err);
        res.type('txt').send(data.toString());
      });
    });
    
};