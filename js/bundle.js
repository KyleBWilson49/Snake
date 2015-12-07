/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var View = __webpack_require__(1);
	var Board = __webpack_require__(2);
	
	$(function () {
	  var root = $('.snake-game');
	  var board = new Board();
	  new View(root, board);
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	function View ($el, board) {
	  this.$el = $el;
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
	    100: 'E'
	  };
	  var key = e.which;
	  if (key === 112) {
	    this.pauseGame();
	  } else {
	    this.board.snake.turn(directions[key]);
	  }
	};
	
	View.prototype.runGame = function () {
	  var view = this;
	  this.interval = setInterval(function () {
	    view.takeTurn();
	  }, 100);
	  this.interval;
	};
	
	View.prototype.pauseGame = function () {
	  if (this.paused) {
	    this.paused = false;
	    this.runGame();
	  } else {
	    clearInterval(this.interval);
	    this.interval = 0;
	    this.paused = true;
	  }
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Snake = __webpack_require__(3);
	var Apple = __webpack_require__(4);
	
	function Board () {
	  this.snake = new Snake('E');
	  this.apple = new Apple();
	}
	
	module.exports = Board;


/***/ },
/* 3 */
/***/ function(module, exports) {

	function Snake (direction) {
	  this.dir = direction;
	  this.segments = [[0,1],[0,0]];
	}
	
	Snake.prototype.move = function () {
	  var directions = {
	    N: [-1, 0],
	    S: [1, 0],
	    E: [0, 1],
	    W: [0, -1]
	  };
	
	  var head = this.segments[0];
	  var moveDir = directions[this.dir];
	  var newPos = [head[0] + moveDir[0], head[1] + moveDir[1]];
	  
	  this.segments.unshift(newPos);
	  this.segments.pop();
	};
	
	Snake.prototype.turn = function (newDirection) {
	  this.dir = newDirection;
	};
	
	module.exports = Snake;


/***/ },
/* 4 */
/***/ function(module, exports) {

	function Apple () {
	  this.position = this.randomPosition();
	}
	
	Apple.prototype.randomPosition = function () {
	  return [this.randomNumber(29), this.randomNumber(39)];
	};
	
	Apple.prototype.randomNumber = function (max) {
	  return Math.floor(Math.random() * max);
	};
	
	module.exports = Apple;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map