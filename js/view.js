function View ($el, board, points) {
  this.$el = $el;
  this.points = points.points
  this.points2 = points.points
  this.turn = 0;
  this.applePos = 0;
  this.paused = false;
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
    100: 'E',
    52: 'W',
    53: 'S',
    54: 'E',
    56: 'N'
  };

  var key = e.which;
  var dir = directions[key]
  if (key === 112) {
    this.pauseGame();
  } else if (key === 13) {
    location.reload();
  } else if (dir && key > 60){
    this.board.snake.turn(dir);
  } else if (dir && key < 60) {
    this.board.snake2.turn(dir);
  }
};

View.prototype.runGame = function () {
  var view = this;
  this.interval = setInterval(function () {
    view.takeTurn();
  }, 80);
  this.interval;
};

View.prototype.pauseGame = function () {
  if (this.paused) {
    this.paused = false;
    this.runGame();
    $('.snake-game').removeAttr('id')
  } else {
    clearInterval(this.interval);
    this.interval = 0;
    this.paused = true;
    $('.snake-game').attr('id', 'paused')
  }
};

View.prototype.takeTurn = function () {
  this.board.snake.move();
  this.board.snake2.move();
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

  var headPosition = this.board.snake2.segments[0];

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
  var oldSnakes = [].slice.call($('.snake1'));
  oldSnakes.forEach(function (el) {
    $(el).removeClass('snake1');
  });

  var oldSnakes = [].slice.call($('.snake2'));
  oldSnakes.forEach(function (el) {
    $(el).removeClass('snake2');
  });
  // var snake = this.board.snake.segments;
  // var snakeLength = snake.length;
  // var tail = snake[snakeLength - 1];
  // var $tailElement = $("li[data-pos='" + tail +"']");
  // $tailElement.removeClass('snake');

  var currentSnake = this.board.snake.segments;
  var currentSnake2 = this.board.snake2.segments;
  var squares =[].slice.call($('li'));
  var that = this;

  var $applePos = $("li[data-pos='" + that.applePos.toString() +"']");
  $applePos.addClass('apple');

  currentSnake.forEach(function (pos) {
    var $snakePos = $("li[data-pos='" + pos +"']");
    $snakePos.addClass('snake1');
  });

  currentSnake2.forEach(function (pos) {
    var $snakePos = $("li[data-pos='" + pos +"']");
    $snakePos.addClass('snake2');
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
    this.points += 10;
    $('.points').html('Points: ' + this.points)
  }

  var headPos = this.board.snake2.segments[0];
  var $apple = $('.apple');
  if (this.applePos[0] === headPos[0] && this.applePos[1] === headPos[1]) {
    $apple.removeClass('apple');
    this.board.snake2.segments.push(this.applePos);
    this.board.snake2.segments.push(this.applePos);
    this.applePos = 0;
    this.points2 += 10;
    $('.points').html('Points: ' + this.points)
  }
};

View.prototype.collide = function () {
  var headPos = this.board.snake.segments[0];
  var headPos2 = this.board.snake2.segments[0];

  var snake = this.board.snake.segments;
  var snake2 = this.board.snake2.segments;

  for (var i = 1; i < snake.length; i++) {
    if (headPos2[0] === snake[i][0] && headPos2[1] === snake[i][1]) {
      this.gameOver();
    }
    if (headPos[0] === snake[i][0] && headPos[1] === snake[i][1]) {
      this.gameOver();
    }
  }
  if (headPos[0] === headPos2[0] && headPos[1] === headPos2[1]) {
    this.gameOver();
  }

  for (var i = 1; i < snake2.length; i++) {
    if (headPos[0] === snake2[i][0] && headPos[1] === snake2[i][1]) {
      this.gameOver();
    }
    if (headPos2[0] === snake2[i][0] && headPos2[1] === snake2[i][1]) {
      this.gameOver();
    }
  }
};

View.prototype.gameOver = function () {
  this.$el.append($('<div class="div1">Game Over!<div>'))
  this.$el.append($("<div class='div2'>Press Enter To Restart<div>"))
  clearInterval(this.interval);
  this.interval = 0;
};

module.exports = View;
