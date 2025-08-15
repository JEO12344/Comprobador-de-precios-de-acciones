process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const runner = {
  run: () => {
    console.log('Running tests...');
    require('./tests/2_functional-tests.js');
  }
};

module.exports = runner;