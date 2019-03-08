var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[2];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var kytmp;
time_update_interval = 0;

function onYouTubeIframeAPIReady() {
        kytmp = new YT.Player('video-placeholder', {
        width: 0,
        height: 0,
        playerVars: {
            'rel': 0,
            'showinfo': 0,
            'autoplay': 0,
            'loop': 1,
            'autohide': 1,
            'color': 'white',
            'theme': 'light',
            'controls': 0
        },
        events: {
            onReady: initPlayer,
            onStateChange: updateTitle
        }
    });
}
/*START IT*/
/*var randomIndex = (1 + Math.floor(Math.random() * 10));*/
var playlistID = 'PLztjkKZ7QxkoQi_T3FLU7VweQ1LDEqmsi';
function onPlayerReady(event) {
    kytmp.addEventListener('onStateChange', function(e) {
        buttonsOnPlayerState();
    }); 
    kytmp.addEventListener('onStateChange', 'onPlayerStateChange');
    kytmp.loadPlaylist({
        'listType': 'playlist',
        'list': playlistID,
        'index': '0',
        'startSeconds': '0',
        'suggestedQuality': '240p'
    });
    kytmp.setShuffle({
        'shufflePlaylist': 0
    });
}

function initPlayer() {
    updateTimerDisplay();
    updateProgressBar();
    updateTitle();
    clearInterval(time_update_interval);
    time_update_interval = setInterval(function () {
        updateTimerDisplay();
        updateProgressBar();
    }, 1000)
    onPlayerReady();

}
/*We need to get everything mo`fka*/
function updateTitle() {
    $('#title').text(kytmp.getVideoData().title);
}
//update timer
function updateTimerDisplay() {
    $('#current-time').text(formatTime(kytmp.getCurrentTime()));
    $('#duration').text(formatTime(kytmp.getDuration()));
}
//format fokin toim
function formatTime(time) {
    time = Math.round(time);
    var minutes = Math.floor(time / 60),
    seconds = time - minutes * 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return minutes + ":" + seconds;
}
/*Progress BAR*/
$('#progress-bar').on('mouseup touchend', function (e) {
    var newTime = kytmp.getDuration() * (e.target.value / 100);
    kytmp.seekTo(newTime);

});
function updateProgressBar() {
    $('#progress-bar').val((kytmp.getCurrentTime() / kytmp.getDuration()) * 100);
}
/*Submit your playlist link*/
function setPlayList() {
    var plink = $('#playlistLink').val();
    playlistID = plink;
    console.log(plink);
}
$('#submitPlaylist').click(function(){
    setPlayList();
    initPlayer();
});
/*Buttons*/
$('#play').on('click', function () {
    kytmp.playVideo();
    $('#play').css('display', 'none');
    $('#pause').css('display', 'inline');

});
$('#pause').on('click', function () {
    kytmp.pauseVideo();
    $('#pause').css('display', 'none');
    $('#play').css('display', 'inline')
});
$('#mute-toggle').on('click', function() {
    var mute_toggle = $(this);
    if (kytmp.isMuted()){
        kytmp.unMute();
        mute_toggle.text('volume_up');
    }
    else {
        kytmp.mute();
        mute_toggle.text('volume_off');
    }
});
$('#volume').on('change', function () {
    kytmp.setVolume($(this).val());
});
$('#next').on('click', function () {
    kytmp.nextVideo();
});
$('#prev').on('click', function () {
    kytmp.previousVideo();
});
/*Forgotten logic*/
function buttonsOnPlayerState() {
    if (kytmp.getPlayerState() == 0) {
        $('#play').css('display', 'inline');
        $('#pause').css('display', 'none');
        console.log('Not playing')
    } else if (kytmp.getPlayerState() == 1) {
        $('#play').css('display', 'none');
        $('#pause').css('display', 'inline');
        console.log('Playing now: '+kytmp.getVideoData().title)
    } else if (kytmp.getPlayerState() == 2) {
        $('#pause').css('display', 'none');
        $('#play').css('display', 'inline');
        console.log('Paused');
    }
}
