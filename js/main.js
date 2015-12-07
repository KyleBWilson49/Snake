var View = require('./view');
var Board = require('./board');
var Points = require('./points')

$(function () {
  var $root = $('.snake-game');
  var points = new Points($root);
  var board = new Board();
  new View($root, board, points);
});
