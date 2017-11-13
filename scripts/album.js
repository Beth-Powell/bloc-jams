// called in someFn
var createSongRow = function(songNumber, songName, songLength) {
//actually creats the html for SongRow. Later runs through for loop to go through each line.
   var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
    //now $row is same as template.
    var $row = $(template);
    //console.log(template);

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
        // $(this) is the song number <td> and we're replacing the number with the pause icon
		    $(this).html(pauseButtonTemplate);
        //$('.main-controls .play-pause').html(playerBarPlayButton);
        //now that the pause button has been activated, the currently playing song number is changed to reflect that
        currentlyPlayingSongNumber = songNumber;
        //this updates the album array so it reflects the correct index number for the current song
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
        updatePlayerBarSong();

	    } else if (currentlyPlayingSongNumber === songNumber) {
		      if (currentSoundFile.isPaused()){
            //revert icon to play??? in the song row
            $(this).html(pauseButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPauseButton);
            //start playing song again
            currentSoundFile.play();
          }else{
            //revert icon to pause??? in the song row
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
      //console.log($(this)); //$(this) is tr album-view-song-item
      //console.log('.song-item-number');
      var songNumber = parseInt(songNumberCell.attr('data-song-number'));
      //console.log(songNumber);

      //if song hovered over is NOT the curently playing song, then the number changes to a play icon when hovered over.
      if (songNumber !== currentlyPlayingSongNumber) {
        songNumberCell.html(playButtonTemplate);
        //currentSongFromAlbum = ("song-item-title");
      }
      //console.log(currentSongFromAlbum);
    };

    var offHover = function(event) {
      var songNumberCell = $(this).find('.song-item-number');
      var songNumber = parseInt(songNumberCell.attr('data-song-number'));

      //this puts the number of the song back after no longer hovered over.
      if (songNumber !== currentlyPlayingSongNumber) {
         songNumberCell.html(songNumber);
      }
      //console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
      //console.log(songNumberCell);
    };

//event handlers that activate the clickHandler function
    $row.find('.song-item-number').click(clickHandler);
//I believe this activates the on and off Hover functions
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
//I couldn't get console.log below to give me anything on console. Why?
  //console.log($albumTitle);
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
