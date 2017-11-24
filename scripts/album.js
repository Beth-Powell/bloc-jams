// called on row 111 in function setCurrentAlbum
var createSongRow = function(songNumber, songName, songLength) {
//actually creates the html for SongRow. Later runs through for loop to go through each line.
   var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
    //now $row is same as template.
    var $row = $(template);

    var clickHandler = function() {
    //sets songNumber to always be equal to stored number in data-song-number. parseInt makes sure is always an integer
	  var songNumber = parseInt($(this).attr('data-song-number'));
      //var currentlyPlayingSongNumber is defined outside the function initially as null until a song is clicked upon.
	    if (currentlyPlayingSongNumber !== null) {
		    // Reverts to song number for currently playing song because user started playing new song.
        var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
		    currentlyPlayingCell.html(currentlyPlayingSongNumber);
	    }
	    if (currentlyPlayingSongNumber !== songNumber) {
        // Switch from Play -> Pause button to indicate new song is playing.
        setSong(songNumber);
        currentSoundFile.play();

        updateSeekBarWhileSongPlays();

        //set the CSS of the volume seek bar for fill and thumb to equal the currentVolume
        var $volumeFill = $('.volume .fill');
        var $volumeThumb = $('.volume .thumb');
        $volumeFill.width(currentVolume + '%');
        $volumeThumb.css({left: currentVolume + '%'});

        // $(this) is the song number <td> and we're replacing the number with the pause icon
		    $(this).html(pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
        //now that the pause button has been activated, the currently playing song number is changed to reflect that
        currentlyPlayingSongNumber = songNumber;
        //this updates the album array so it reflects the correct index number for the current song
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

        updatePlayerBarSong();

	    } else if (currentlyPlayingSongNumber === songNumber) {
		      if (currentSoundFile.isPaused()){
            //revert icon to play in the song row
            $(this).html(pauseButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPauseButton);
            //start playing song again
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
          }else{
            //revert icon to pause in the song row
            $(this).html(playButtonTemplate);
            //set the player bar pause button back to the play button???
            $('.main-controls .play-pause').html(playerBarPlayButton);
            //pause the song
            currentSoundFile.pause();
          }
      }
    };

    //function to control what happens when mouse hovers over song number
    var onHover = function(event) {
      //in table row album-view-song-item, it finds the song-item-number and parks it in this variable
      var songNumberCell = $(this).find('.song-item-number');
      var songNumber = parseInt(songNumberCell.attr('data-song-number'));

      //if song hovered over is NOT the currently playing song, than the number changes to a play icon when hovered over.
      if (songNumber !== currentlyPlayingSongNumber) {
        songNumberCell.html(playButtonTemplate);
        currentSongFromAlbum = ("song-item-title");
      }
    };

    var offHover = function(event) {
      var songNumberCell = $(this).find('.song-item-number');
      var songNumber = parseInt(songNumberCell.attr('data-song-number'));

      //this puts the number of the song back after no longer hovered over.
      if (songNumber !== currentlyPlayingSongNumber) {
         songNumberCell.html(songNumber);
      }
    };

//event handlers that activate the clickHandler function
  $row.find('.song-item-number').click(clickHandler);
//Activates the on and off Hover functions
  $row.hover(onHover, offHover);
  return $row;
};

var setCurrentAlbum = function(album) {
  currentAlbum = album;
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);
  $albumSongList.empty();

  //this cycles through the songs in the album defined in setCurrentAlbum (currently Picasso) and creates the SongRows.
  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
      $albumSongList.append($newRow);
  }
};
var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         currentSoundFile.bind('timeupdate', function(event) {
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');

             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
     }
 };

 var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         // Here we bind() the timeupdate event to currentSoundFile.
         //timeupdate is a custom Buzz event that fires repeatedly while time elapses during song playback
         currentSoundFile.bind('timeupdate', function(event) {
             //Here We use Buzz's  getTime() method to get the current time of the song and
             //the getDuration() method for getting the total length of the song. Both values return time in seconds.
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');

             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
     }
 };

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    // max means it doesn't go below 0; min means doesn't go above 100);
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);

    // Convert the percentage to a string and add the % character. Where makes a string?
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

 var setupSeekBars = function() {
     //using jQuery to find all elements in the DOM with a class of "seek-bar" that are contained;
     //within the element with a class of "player-bar". Will return a jQuery wrapped array;
     var $seekBars = $('.player-bar .seek-bar');

     $seekBars.click(function(event) {
      //sets up a new property called pageX, which holds the x coordinate of the seekBar;
      //then subtracts where the seekBar starts from the left of the page (offset.left); from
      //the start of the seekBar (pageX) to get the amount from start where the bar was clicked
      var offsetX = event.pageX - $(this).offset().left;
      var barWidth = $(this).width();
      //divide the indent from left of the bar by the width of the bar
      var seekBarFillRatio = offsetX / barWidth;

      //checks the class of the seek bar's parent to see which is changing
      //if is the song seek bar, then
      if ($(this).parent().attr('class') == 'seek-control'){
        //seeks the position of the song determined by the seekBarFillRatio;
        seek(seekBarFillRatio * currentSoundFile.getDuration());
      //Otherwise the volume bar is affected
     } else {
      //update the volume seek bar with the seekBarFillRatio;
        setVolume(seekBarFillRatio * 100);
      }

      //$(this) is whatever seek bar was clicked on;
      updateSeekPercentage($(this), seekBarFillRatio);
    });
    //we find elements with a class of .thumb inside our $seekBars and add
    //an event listener for the mousedown event.
    $seekBars.find('.thumb').mousedown(function(event) {
      //we are taking the context of the event and wrapping it in jQuery.
      //(this) will be equal to the .thumb node that was clicked
      //parent will be whichever seek bar this .thumb belongs to
      var $seekBar = $(this).parent();


      // takes a string of an event instead of wrapping the event in a method
      //it allows us to namespace (specify) event listeners, here mousemove
      //We've attached the mousemove event to $(document) instead of $seekBars, to make sure that we can drag the
      //thumb after mousing down, even when the mouse leaves the seek bar.
      $(document).bind('mousemove.thumb', function(event){
         var offsetX = event.pageX - $seekBar.offset().left;
         var barWidth = $seekBar.width();
         var seekBarFillRatio = offsetX / barWidth;

         //checks the class of the seek bar's parent to see which is changing
         //if is the song seek bar, then
         if ($(this).parent().attr('class') == 'seek-control'){
           //seeks the position of the song determined by the seekBarFillRatio;
           seek(seekBarFillRatio * currentSoundFile.getDuration());
         //Otherwise the volume bar is affected
         }else{
         //update the volume seek bar with the seekBarFillRatio;
           setVolume(seekBarFillRatio * 100);
         }

         updateSeekPercentage($seekBar, seekBarFillRatio);
      });

      // we bind the mouseup event with a .thumb namespace
      $(document).bind('mouseup.thumb', function() {
         //If we fail to unbind() the event handlers, the thumb and fill would continue to move even after the user released the mouse.
         $(document).unbind('mousemove.thumb');
         $(document).unbind('mouseup.thumb');
      });
  });

};

  //updates the song showing as playing in the bar at bottom
var updatePlayerBarSong = function() {
    //changes out text at the top of the bar for the currentSongFromAlbum title
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    //changes out text at the bottom of the bar for the currentAlbum artist
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    //on a mobile screen, changes out the text on the player bar for the current song title and artist, and combines in one line
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);

    $('.main-controls .play-pause').html(playerBarPauseButton);
};


 //function to track index of album and song
var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
};

 //function to find the next song by index number by clicking on the next icon on the player bar
var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;
      //if index is on last song, then resets index for next song to first song
      if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
      }
    // Save the last song number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;
    // Set a new current song
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    // Update the Player Bar information
    updatePlayerBarSong();

    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    // Save the last song number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;
    // Set a new current song
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    // Update the Player Bar information
    updatePlayerBarSong();

    //Updates the player bar with the Pause button>
    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

//function sets current song
var setSong = function(songNumber){
  //checks to see if currentSoundFile exists other than null, and stops song if so
  if (currentSoundFile) {
    currentSoundFile.stop();
  }
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         formats: [ 'mp3' ],
         preload: true
  });
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

  setVolume(currentVolume);
}

var getSongNumberCell = function(number){
  return $('.song-item-number[data-song-number="' + number + '"]');
}

//this function uses the Buzz setTime() method to change the position in a song to a specified time
var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 }

var setVolume = function(volume) {
   if (currentSoundFile) {
       currentSoundFile.setVolume(volume);
   }
};

var togglePlayFromPlayerBar = function(){
    if (currentSoundFile.isPaused()) {
    // song is paused, so a play button is visible. Next line starts the current song playing
    currentSoundFile.play();
    // Changes the song number cell from a play button to a pause button to indicate a song is playing
    var songNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    songNumberCell.html(pauseButtonTemplate);
    // Switch player bar from Play -> Pause button to indicate song is playing.
    $('.main-controls .play-pause').html(playerBarPauseButton);

  //otherwise if a song is playing and icon is clicked,
  } else if (currentSoundFile) {
    //pauses the current song
    currentSoundFile.pause();
    // Changes the song number cell from a pause button to a play button to indicate song can be clicked to be played again
    var songNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    songNumberCell.html(playButtonTemplate);
    // Switch player bar from Pause -> Play button to indicate song can be started (played) again.
    $('.main-controls .play-pause').html(playerBarPlayButton);
  }
};


var albumImage;
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentlyPlayingSong = null;
var currentAlbum = null;
var currentlyPlayingSongNumber //= parseInt(null);
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $mainControlsPlayPause = $('.main-controls .play-pause');

$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
  $mainControlsPlayPause.click(togglePlayFromPlayerBar);
  setupSeekBars();
});

//   var albums = [albumPicasso, albumMarconi, albumTesla];
//   var albumIndex = 0;
//   albumImage.addEventListener('click', function(){
//   albumIndex++;
//     if(albumIndex === albums.length){
//       albumIndex = 0;
//     }
//     setCurrentAlbum(albums[albumIndex]);
//   });
