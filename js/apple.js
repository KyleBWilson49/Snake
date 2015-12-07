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
