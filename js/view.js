function View ($el, board) {
  this.$el = $el;
  this.turn = 0;
  this.applePos = 0;
  this.board = board;
  this.setupBoard();
  this.bindEvents();
  this.runGame();
}

View.prototype.bindEvents = function () {
  var view = this;
  document.onkeypress = function (e) {
    view.handleKeyPress(e);
  };
};

View.prototype.setupBoard = function () {
  var $board = $('<ul>');

  for (var row = 0; row < 30; row++) {
    for (var col = 0; col < 40; col++) {
      var $square = $('<li>').attr('data-pos', row + ',' + col);
      $board.append($square);
    }
  }

  this.$el.append($board);
};

View.prototype.handleKeyPress = function(e) {
  var directions = {
    119: 'N',
    115: 'S',
    97: 'W',
    100: 'E'
  };
  var key = e.which;
  this.board.snake.turn(directions[key]);
};

View.prototype.runGame = function () {
  var view = this;
  this.interval = setInterval(function () {
    view.takeTurn();
  }, 100);
  this.interval();
};

View.prototype.takeTurn = function () {
  this.board.snake.move();
  this.outOfBounds();
  this.collide();
  this.eatApple();
  this.placeApple();
  this.drawBoard();
  this.turn++;
};

View.prototype.outOfBounds = function () {
  var inBounds = true;
  var headPosition = this.board.snake.segments[0];

  if (headPosition[0] > 29 || headPosition[0] < 0) {
    inBounds = false
  } else if (headPosition[1] > 39 || headPosition[1] < 0) {
    inBounds = false
  }

  if (!inBounds) {
    this.gameOver();
  }
};

View.prototype.drawBoard = function () {
  var oldSnakes = [].slice.call($('.snake'));
  oldSnakes.forEach(function (el) {
    $(el).removeClass('snake');
  });
  // var snake = this.board.snake.segments;
  // var snakeLength = snake.length;
  // var tail = snake[snakeLength - 1];
  // var $tailElement = $("li[data-pos='" + tail +"']");
  // $tailElement.removeClass('snake');

  var currentSnake = this.board.snake.segments;
  var squares =[].slice.call($('li'));
  var that = this;

  var $applePos = $("li[data-pos='" + that.applePos.toString() +"']");
  $applePos.addClass('apple');

  currentSnake.forEach(function (pos) {
    var $snakePos = $("li[data-pos='" + pos +"']");
    $snakePos.addClass('snake');
  });

  // var pos = this.board.snake.segments[0]
  // var $snakePos = $("li[data-pos='" + pos +"']");
  // $snakePos.addClass('snake');
};

View.prototype.placeApple = function () {
  if (this.turn % 10 === 0 && this.applePos === 0) {
    this.applePos = this.board.apple.randomPosition();
  }
};

View.prototype.eatApple = function () {
  var headPos = this.board.snake.segments[0];
  var $apple = $('.apple');
  if (this.applePos[0] === headPos[0] && this.applePos[1] === headPos[1]) {
    $apple.removeClass('apple');
    this.board.snake.segments.push(this.applePos);
    this.board.snake.segments.push(this.applePos);
    this.applePos = 0;
  }
};

View.prototype.collide = function () {
  var headPos = this.board.snake.segments[0];
  var snake = this.board.snake.segments;
  for (var i = 1; i < snake.length; i++) {
    if (headPos[0] === snake[i][0] && headPos[1] === snake[i][1]) {
      this.gameOver();
    }
  }
};

View.prototype.gameOver = function () {
  alert("Game Over!");
  clearInterval(this.interval);
  this.interval = 0;
};

module.exports = View;
