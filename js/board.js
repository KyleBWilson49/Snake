var Snake = require('./snake');
var Apple = require('./apple');

function Board () {
  this.snake = new Snake('E');
  this.apple = new Apple();
}

module.exports = Board;
