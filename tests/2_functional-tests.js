const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(10000);
  
  suite('GET /api/stock-prices => stockData object', function() {
    
    test('Viewing one stock: GET request to /api/stock-prices/', function(done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'GOOG'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'stockData');
          assert.property(res.body.stockData, 'stock');
          assert.property(res.body.stockData, 'price');
          assert.property(res.body.stockData, 'likes');
          assert.equal(res.body.stockData.stock, 'GOOG');
          assert.isNumber(res.body.stockData.price);
          assert.isNumber(res.body.stockData.likes);
          done();
        });
    });
    
    test('Viewing one stock and liking it: GET request to /api/stock-prices/', function(done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'GOOG', like: 'true'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'stockData');
          assert.property(res.body.stockData, 'stock');
          assert.property(res.body.stockData, 'price');
          assert.property(res.body.stockData, 'likes');
          assert.equal(res.body.stockData.stock, 'GOOG');
          assert.isNumber(res.body.stockData.price);
          assert.isNumber(res.body.stockData.likes);
          assert.isAtLeast(res.body.stockData.likes, 1);
          done();
        });
    });
    
    test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', function(done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'GOOG', like: 'true'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'stockData');
          assert.property(res.body.stockData, 'stock');
          assert.property(res.body.stockData, 'price');
          assert.property(res.body.stockData, 'likes');
          assert.equal(res.body.stockData.stock, 'GOOG');
          assert.isNumber(res.body.stockData.price);
          assert.isNumber(res.body.stockData.likes);
          done();
        });
    });
    
    test('Viewing two stocks: GET request to /api/stock-prices/', function(done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['GOOG', 'MSFT']})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'stockData');
          assert.isArray(res.body.stockData);
          assert.equal(res.body.stockData.length, 2);
          
          assert.property(res.body.stockData[0], 'stock');
          assert.property(res.body.stockData[0], 'price');
          assert.property(res.body.stockData[0], 'rel_likes');
          assert.notProperty(res.body.stockData[0], 'likes');
          
          assert.property(res.body.stockData[1], 'stock');
          assert.property(res.body.stockData[1], 'price');
          assert.property(res.body.stockData[1], 'rel_likes');
          assert.notProperty(res.body.stockData[1], 'likes');
          
          assert.isNumber(res.body.stockData[0].price);
          assert.isNumber(res.body.stockData[1].price);
          assert.isNumber(res.body.stockData[0].rel_likes);
          assert.isNumber(res.body.stockData[1].rel_likes);
          done();
        });
    });
    
    test('Viewing two stocks and liking them: GET request to /api/stock-prices/', function(done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['GOOG', 'MSFT'], like: 'true'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'stockData');
          assert.isArray(res.body.stockData);
          assert.equal(res.body.stockData.length, 2);
          
          assert.property(res.body.stockData[0], 'stock');
          assert.property(res.body.stockData[0], 'price');
          assert.property(res.body.stockData[0], 'rel_likes');
          assert.notProperty(res.body.stockData[0], 'likes');
          
          assert.property(res.body.stockData[1], 'stock');
          assert.property(res.body.stockData[1], 'price');
          assert.property(res.body.stockData[1], 'rel_likes');
          assert.notProperty(res.body.stockData[1], 'likes');
          
          assert.isNumber(res.body.stockData[0].price);
          assert.isNumber(res.body.stockData[1].price);
          assert.isNumber(res.body.stockData[0].rel_likes);
          assert.isNumber(res.body.stockData[1].rel_likes);
          done();
        });
    });
    
  });

});