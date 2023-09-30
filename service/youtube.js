//tk link -crop=100-105
//tk link -loop (to loop)
//tk link -list
//tk link -2x (to play video on 2x speed or you can change the speed anyway you want)
//tk link -95v (to change volume from 100 to 95 or any other volume level)
//tk link -125 (to play at 00:00:125)

//&enablejsapi=1
let apiKey = `AIzaSyASq2_wSS45nCkxTy71WW5CKAhPzRn6pHU`;
let youtube_parameters = null; // save parameters here in case we use commands and parameters get overriden.


let youtube_cmds = [
    "playVideo()",
    "pauseVideo()",
    "stopVideo()",
    "clearVideo()",
    "nextVideo()",
    "previousVideo()",
    "mute()",
    "unMute()",
    "setVolume(vol)",
    "seekTo(time)",
    "setPlaybackRate(rate)",
    "showVideoInfo()",
    "hideVideoInfo()",
]


function YouTubeGetID(v) {
    // v = v.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    v = v.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/|\/shorts\/)/);
    return (v[2] !== undefined) ? v[2].split(/[^0-9a-z_\-]/i)[0] : v[0];
}

let youtube_crop_start = -1;

function youtube_main() {
    console.log('>> inside youtube_main');
    console.log(link_url);
    console.log(packet.param);
    //---------------------------
    let href = decodeURI(link_url.href);
    let this_url = '';
    let list_id = '';
    let video_id = '';

    if ('list' in packet.param
        || link_url.pathname.toLowerCase().includes('videoseries')
        // https://youtube.com/playlist?list=PLvlw_ICcAI4dXql41zUwAY2FnsCIzT5b-&si=vvV7G_TuqFv4pRj-
        || link_url.pathname.toLowerCase().includes('playlist')) { // list
        //---------------------------
        if (!href.includes('list=LL') && !href.toLowerCase().includes('start_radio=1')) {
            //---------------------------
            if (link_url.searchParams.has('playlist')) { list_id = link_url.searchParams.get('playlist') }
            if (link_url.searchParams.has('list')) { list_id = link_url.searchParams.get('list') }
            //---------------------------
            if ('loop' in packet.param) { // loop
                this_url = `https://www.youtube.com/embed/videoseries?list=${list_id}&enablejsapi=1&controls=0&loop=1&`;
            } else {
                this_url = `https://www.youtube.com/embed/videoseries?list=${list_id}&enablejsapi=1&controls=0&`;
            }
        }
    } else if (list_id == '') { // single
        //---------------------------
        video_id = YouTubeGetID(href);
        console.log(`youtube@video_id: ${video_id}`);
        //---------------------------
        let t_ = parseInt(link_url.searchParams.get('t')) || parseInt(link_url.searchParams.get('time')) || 0;
        if ('t' in packet.param) { t_ += (parseInt(packet.param['t']) || 0); }
        //---------------------------



        youtube_crop_start = -1;
        let start = t_;
        let end = -1;

        if ('crop' in packet.param) { // crop:'100-200'
            let crop = packet.param['crop'].split('-');
            try {
                youtube_crop_start = Number(crop[0]);
                start += Number(crop[0]);
            } catch (e) { console_(e); }
            try { if (crop.length > 1) { end = Number(crop[1]); } } catch (e) { console_(e); }
        }

        this_url = `https://www.youtube.com/embed/${video_id}?enablejsapi=1&controls=0&start=${start}`;
        if (end != -1) { this_url += `&end=${end}`; }
    }

    if ('mute' in packet.param) {
        this_url += '&mute=1';
    }
    youtube_parameters = packet.param;
    youtube_call(this_url);
}


//////////////     //////////////
///        ///     ///        ///
///        ///     ///        ///
///        ///     ///        ///
//////////////     //////////////

//////////////
///        ///     Just a Break
///        ///     Betweem
///        ///     My Codes...
//////////////             _Tiki




function youtube_call(url) {
    console.log(url);
    iframe.setAttribute('src', url);
    if (!youtube_initialized) { youtube_initialization(); }
    console.log(iframe);
}

let youtube_initialized = false;

function youtube_initialization() {
    let tag = document.createElement('script');
    tag.id = 'iframe-demo';
    tag.src = 'https://www.youtube.com/iframe_api';
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    youtube_initialized = true;
}

function onYouTubeIframeAPIReady() {
    let options = {
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    };
    player = new YT.Player('video-iframe', options);
}

function onPlayerReady(event) {
    player.playVideo();
    setYoutubePlaybackRate();
    setYoutubeVolume();
}

if (iframe.getAttribute('src') != "no-source") {
    youtube_initialization();
}

let YT_states = [0, 0, 0];

function onPlayerStateChange(event) {
    YT_states.unshift(event.data);
    YT_states.pop();
    if ( // == FIRST LOAD OF every VIDEO ( -1:unstarted , 3:buffering , 1:playing )
        YT_states[0] == YT.PlayerState.PLAYING &&
        YT_states[1] == YT.PlayerState.BUFFERING &&
        YT_states[2] == YT.PlayerState.UNSTARTED
    ) { getTitle(); }
    if (event.data == YT.PlayerState.ENDED && quedPacket.length > 0) { // if we have something in QUE
        sessionEnded();
    } else if (event.data == YT.PlayerState.ENDED && 'loop' in youtube_parameters && !('list' in youtube_parameters)) {
        player.playVideo();
        if (youtube_crop_start != -1) { player.seekTo(youtube_crop_start); }
    }

    function getTitle() {
        let title = player.videoTitle;
        document.title = title;
        console_(`___ [${title}]`);
        console_(`___ [${player.getDuration()}]`);
    }
}

/**
 * @parameter {"99.9x":null} to set playback rate
 */
function setYoutubePlaybackRate() {
    let rate = null;
    Object.keys(packet.param).forEach(p => {
        let matches = p.match(/^(\d+\.?\d*)x$/i);
        if (matches && matches.length > 1) { rate = Number(matches[1]); }
    });
    if (rate) {
        player.setPlaybackRate(rate);
    }
}

/**
 * @parameter {"99.9v":null} to set volume. (0-100)
 */
function setYoutubeVolume() {
    let vol = null;
    let act = false;
    Object.keys(packet.param).forEach(p => {
        let matches = p.match(/^(\d+\.?\d*)v$/i);
        if (matches && matches.length > 1) { vol = Number(matches[1]); }
    });
    if (vol) {
        if (vol < 0) { vol = 0; }
        if (vol > 100) { vol = 100; }
        player.setVolume(vol);
    }
}