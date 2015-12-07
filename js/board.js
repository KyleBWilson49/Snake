var Snake = require('./snake');
var Apple = require('./apple');

function Board () {
  this.snake = new Snake('E', [[0,1],[0,0]]);
  this.snake2 = new Snake('W', [[29,38],[29,39]])
  this.apple = new Apple();
}

module.exports = Board;
