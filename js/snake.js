function Snake (direction, segments) {
  this.dir = direction;
  this.segments = segments;
  this.turning = false;
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
  this.turning = false;
};

Snake.prototype.turn = function (newDirection) {
  if (this.dir === 'N' && newDirection === 'S' ||
    this.dir === 'S' && newDirection === 'N' ||
    this.dir === 'W' && newDirection === 'E' ||
    this.dir === 'E' && newDirection === 'W' ||
    this.turning) {
      return;
    }

  this.dir = newDirection;
  this.turning = true;
};

module.exports = Snake;
