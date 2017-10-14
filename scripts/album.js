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

       if (currentlyPlayingSong !== null) {
         //if one song is playing and user chooses another, play button reverts to song number.
         var currentlyPlayingSongElement = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
         currentlyPlayingSongElement.html(currentlyPlayingSong);
       }
       if (currentlyPlayingSong !== songNumber){
         // Pause button appears to show which song is playing
         $(this).html(pauseButtonTemplate);
         currentlyPlayingSong = songNumber;

       } else if (currentlyPlayingSong === songNumber) {
         // Switches button from Pause to Play to pause the current song
           $(this).html(playButtonTemplate)
           currentlyPlayingSong = null;
       }
  };

     var onHover = function(event) {
       var songItemNumber = $(this).find('.song-item-number');
       var songNumber = songItemNumber.attr('data-song-number');

         if songNumber !== currentlyPlayingSong) {
           songItemNumber.html(playButtonTemplate);
         }
     };

     var offHover = function(event) {
       var songItemNumber = $(this).find('.song-item-number');
       var songNumber = songItemNumber.attr('data-song-number');

         if (songItemNumber !== currentlyPlayingSong) {
           songItemNumber.html(songNumber);
         }
     };

     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;
 };

 var setCurrentAlbum = function(album) {

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

var albumImage;
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var currentlyPlayingSong = null;
var currentAlbum = null;

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
