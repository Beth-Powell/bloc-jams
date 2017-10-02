var pointsArray = document.getElementsByClassName('point');

var animatePoints = function(points){

  var revealPoint = function(point){
    point.style.opacity = 1;
    point.style.transform = "scaleX(1) translateY(0)";
    point.style.msTransform = "scaleX(1) translateY(0)";
    point.style.WebkitTransform = "scaleX(1) translateY(0)";
  }

  forEach(points, revealPoint);

}

$(window).load = function(){
  if ($(window).height() > 950) {
    animatePoints();
  }

   var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;

   $(window).scroll(function(event) {
     if ($(window).scrollTop() >= scrollDistance) {
       animatePoints();
     }
   });
});


  $(window).scrollTop() >= scrollDistance){
      animatePoints();
    }
  });
});
