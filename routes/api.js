const crypto = require('crypto');
const https = require('https');

let stockData = [];

function hashIP(ip) {
  return crypto.createHash('sha256').update(ip + 'salt-key-for-privacy').digest('hex');
}

function getStockPrice(symbol) {
  return new Promise((resolve, reject) => {
    const url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData.latestPrice);
        } catch (error) {
          resolve(null);
        }
      });
    }).on('error', (error) => {
      resolve(null);
    });
  });
}

module.exports = function (app) {
  app.route('/api/stock-prices')
    .get(async function (req, res) {
      const { stock, like } = req.query;
      const hashedIP = hashIP(req.ip);

      if (Array.isArray(stock)) {
        const results = [];
        
        for (let symbol of stock) {
          symbol = symbol.toUpperCase();
          const price = await getStockPrice(symbol);
          
          let stockEntry = stockData.find(s => s.stock === symbol);
          if (!stockEntry) {
            stockEntry = { stock: symbol, likes: [], price: price };
            stockData.push(stockEntry);
          }
          
          if (like === 'true' && !stockEntry.likes.includes(hashedIP)) {
            stockEntry.likes.push(hashedIP);
          }
          
          results.push({
            stock: symbol,
            price: price,
            likes: stockEntry.likes.length
          });
        }
        
        const rel_likes_0 = results[0].likes - results[1].likes;
        const rel_likes_1 = results[1].likes - results[0].likes;
        
        results[0].rel_likes = rel_likes_0;
        results[1].rel_likes = rel_likes_1;
        
        delete results[0].likes;
        delete results[1].likes;
        
        return res.json({ stockData: results });
        
      } else {
        const symbol = stock.toUpperCase();
        const price = await getStockPrice(symbol);
        
        let stockEntry = stockData.find(s => s.stock === symbol);
        if (!stockEntry) {
          stockEntry = { stock: symbol, likes: [], price: price };
          stockData.push(stockEntry);
        }
        
        if (like === 'true' && !stockEntry.likes.includes(hashedIP)) {
          stockEntry.likes.push(hashedIP);
        }
        
        return res.json({
          stockData: {
            stock: symbol,
            price: price,
            likes: stockEntry.likes.length
          }
        });
      }
    });
};