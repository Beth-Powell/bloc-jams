 var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;

     return $(template);
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


var findParentByClassName = function(element, targetClass) {
  if (element){
    if (element.parentElement == null) {
      return console.log('Parent not found');
    }

    var currentParent = element.parentElement;
    while (currentParent.className !== targetClass && currentParent.className !== null) {
      currentParent = currentParent.parentElement;
    }

    if(currentParent == null){
      return console.log('No parent found with that class name');
    } else {
      return currentParent;
    }
  }
};

var getSongItem = function(element) {
    switch (element.className) {
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
            return findParentByClassName(element, 'song-item-number');
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        case 'song-item-title':
        case 'song-item-duration':
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
            return element;
        default:
            return;
    }
};

var clickHandler = function(targetElement) {

  var songItem = getSongItem(targetElement);

    if (currentlyPlayingSong === null) {
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
    } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
       songItem.innerHTML = playButtonTemplate;
       currentlyPlayingSong = null;
    } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
        var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
        currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    }
 };




var albumImage;
var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var currentlyPlayingSong = null;
var currentAlbum = null;

 window.onload = function() {
     setCurrentAlbum(albumPicasso);

    songListContainer.addEventListener('mouseover', function(event){
      if (event.target.parentElement.className === 'album-view-song-item') {

        var songItem = getSongItem(event.target);

            if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
                songItem.innerHTML = playButtonTemplate;
            }
      }
    });
    for(var i=0; i<songRows.length; i++){
      songRows[i].addEventListener('mouseleave',function(event){

        var songItem = getSongItem(event.target);
        var songItemNumber = songItem.getAttribute('data-song-number');

             if (songItemNumber !== currentlyPlayingSong) {
                 songItem.innerHTML = songItemNumber;
             }
      });

      songRows[i].addEventListener('click', function(event) {
        clickHandler(event.target);
      });
    }
}







//   var albums = [albumPicasso, albumMarconi, albumTesla];
//   var albumIndex = 0;
//   albumImage.addEventListener('click', function(){
//   albumIndex++;
//     if(albumIndex === albums.length){
//       albumIndex = 0;
//     }
//     setCurrentAlbum(albums[albumIndex]);
//   });
