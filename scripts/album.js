 var createSongRow = function(songNumber, songName, songLength) {
   var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;

    var $row = $(template);

    var clickHandler = function() {
	  var songNumber = $(this).attr('data-song-number');

	    if (currentlyPlayingSongNumber !== null) {
		  // Revert to song number for currently playing song because user started playing new song.
		    var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
		    currentlyPlayingCell.html(currentlyPlayingSongNumber);
	    }
	    if (currentlyPlayingSongNumber !== songNumber) {
		    // Switch from Play -> Pause button to indicate new song is playing.
		    $(this).html(pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
		    currentlyPlayingSongNumber = songNumber;
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
        updatePlayerBarSong();

	    } else if (currentlyPlayingSongNumber === songNumber) {
		    // Switch from Pause -> Play button to pause currently playing song.
		    $(this).html(playButtonTemplate);
		    currentlyPlayingSongNumber = null;
        currentSongFromAlbum = null;
	    }
    };

    var onHover = function(event) {
      var songNumberCell = $(this).find('.song-item-number');
      var songNumber = songNumberCell.attr('data-song-number');

      if (songNumber !== currentlyPlayingSongNumber) {
        songNumberCell.html(playButtonTemplate);
        currentSongFromAlbum = ("song-item-title");
      }
    };

    var offHover = function(event) {
      var songNumberCell = $(this).find('.song-item-number');
      var songNumber = songNumberCell.attr('data-song-number');

      if (songNumber !== currentlyPlayingSongNumber) {
         songNumberCell.html(songNumber);
      }
    };

    $row.find('.song-item-number').click(clickHandler);
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

  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
      $albumSongList.append($newRow);
  }
};

var updatePlayerBarSong = function() {

    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);

};

var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
};

var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    // Save the last song number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;

    // Set a new current song
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar information
    updatePlayerBarSong();

    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

//var nextSong = function(){
//  var previousSong;
//  var albumSongIndex = null;
//    if (trackIndex(album, currentSongFromAlbum) > 0){
//      previousSong = title of album at trackIndex - 1;
//      albumSongIndex = previousSong.indexOf();
//      albumSongIndex ++;
//    }
//    if (trackIndex(album, currentSongFromAlbum) == 0){
//      previousSong = title of album at index at album.length - 1);
//      albumSongIndex = 0;
//      albumSongIndex ++;
//    }
//  currentSongFromAlbum = ("song-item-title") at albumSongIndex;
//  updatePlayerBarSong();
//  $previousSong.html(".song-item-number") change to number stored in data-song-number;
//  songNumberCell.html(playButtonTemplate);
//};

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
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar information
    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};
//var updatePlayerBarSong = function(){
//  var $albumArtist = $('.album-view-artist');
//  $('#h2, .song-item-title').html = currentSongFromAlbum;
//  $('#h2, .artist-song-mobile').html = "$albumArtist" + currentSongFromAlbum;
//};

var albumImage;
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
//var currentlyPlayingSong = null;
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
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
