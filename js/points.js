function Points ($root) {
  this.points = 0;
  this.placePoints($root);
}

Points.prototype.placePoints = function ($root) {
  var points = $('<div>').html('Points: ' + this.points).addClass('points');
  $root.append(points);
};

module.exports = Points
