var pointsArray = document.getElementsByClassName('point');

var animatePoints = function(points) {

  function revealPoint(){
    points[index].style.opacity = 1;
    points[index].style.transform = "scaleX(1) translateY(0)";
    points[index].style.msTransform = "scaleX(1) translateY(0)";
    points[index].style.WebkitTransform = "scaleX(1) translateY(0)";
    }
      function forEach(){
        points.forEach(index);
      }
      forEach(revealPoint, index)
};
