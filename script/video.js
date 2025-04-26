player = null;

function video_main() {
    console.log('>> inside video_main');
    console.log(link_url);
    console.log(packet.param);
    //---------------------------
    let href = decodeURI(link_url.href);
    //--------------------------
    let video_parameters = packet.param;
    let static_time = 0;

    //---------------------------
    log = 'Video Loading...';
    console_(log);

    //---------------------------
    const MIME_TYPE = {
        // Streaming formats (supported via videojs-http-streaming)
        'm3u8': 'application/x-mpegURL', // HLS
        'mpd': 'application/dash+xml',   // MPEG-DASH

        // Video formats (natively supported)
        'mp4': 'video/mp4',              // H.264/AAC
        'm4v': 'video/mp4',              // H.264/AAC
        'webm': 'video/webm',            // VP8/VP9, Vorbis/Opus

        // Audio formats (natively supported)
        'mp3': 'audio/mpeg',             // MP3
        'm4a': 'audio/mp4',              // AAC
        'ogg': 'audio/ogg',              // Vorbis/Opus
        'wav': 'audio/wav',              // PCM
        'flac': 'audio/flac',            // FLAC
        'aac': 'audio/aac'               // AAC
    };
    const PLUGIN_http_streaming = 'https://unpkg.com/@videojs/http-streaming@3.15.0/dist/videojs-http-streaming.min.js';
    const PLUGIN = {
        'm3u8': PLUGIN_http_streaming,
        'mpd': PLUGIN_http_streaming
    }

    const videojs_http_streaming = ['m3u8', 'mpd'];

    ////---------------------------
    let src_URL = href;
    let extension = ''; //extension -> MIME_TYPE[key]

    let link_type_found = false;
    Object.keys(MIME_TYPE).forEach(t => { //extracting extension from link
        if (!link_type_found && src_URL.toLowerCase().includes(t)) {
            extension = t;
            link_type_found = true;
        }
    });

    let param_type_found = false;
    Object.keys(MIME_TYPE).forEach(p => { //extracting extension from video_parameters
        if (!param_type_found && p in video_parameters) {
            extension = p;
            param_type_found = true;
        }
    });

    if (!(extension in MIME_TYPE)) {
        throw new Error(`Unsupported media extension: ${extension}. Supported extensions are: ${Object.keys(MIME_TYPE).join(', ')}`);
    }

    ////---------------------------
    //// Load Video.js CSS
    if (window.videojs) {
        initializeVideoJs(src_URL, MIME_TYPE[extension]);
        return;
    }

    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://vjs.zencdn.net/8.23.3/video-js.min.css';
    document.head.appendChild(cssLink);

    // Load Video.js script
    const videoJsScript = document.createElement('script');
    videoJsScript.src = 'https://vjs.zencdn.net/8.23.3/video.min.js';
    videoJsScript.onload = () => {
        if (extension in PLUGIN) {
            // Load plugin after Video.js
            const streamingScript = document.createElement('script');
            streamingScript.src = PLUGIN[extension];
            streamingScript.onload = () => initializeVideoJs(src_URL, MIME_TYPE[extension]);
            streamingScript.onerror = () => {
                console.error('Failed to load videojs plugin');
                throw new Error('Failed to load videojs plugin');
            }
            document.body.appendChild(streamingScript);
        } else {
            initializeVideoJs(src_URL, MIME_TYPE[extension])
        }
    };
    videoJsScript.onerror = () => {
        console.error('Failed to load Video.js');
        throw new Error('Failed to load Video.js');
    };
    document.body.appendChild(videoJsScript);

    ////---------------------------
    ////
    ////
    ////
    function initializeVideoJs(mediaUrl, mimeType) {
        let html = `<video id="my-video" class="video-js" style="position: absolute; top:0; left:0; height:100%; width:100%" autoplay preload="auto"></video>`;
        video = htmlToElement(html);
        const source = document.createElement('source');
        source.src = mediaUrl;
        source.type = mimeType;
        video.appendChild(source);
        console.log(video);
        v_container.appendChild(video);
        player = videojs(document.querySelector('#my-video'));

        //-----------------------------
        player.ready(function () {
            //
            console.log(`VideoJs is Ready...`);
            console.log(`___ [${mimeType}]`);
            console.log(`[SRC] ${mediaUrl}`);
            //
            console_(`___ [${mimeType}]`);
            //

            let url = new URL(href);
            let t_ = parseInt(url.searchParams.get('t')) || parseInt(url.searchParams.get('time')) || 0;
            static_time = t_;
            if ('t' in video_parameters) { t_ += (parseInt(video_parameters['t']) || 0); }
            this.currentTime(t_);
        });

        player.on('ended', function () {
            if (quedPacket.length < 1 && 'loop' in video_parameters) { //no que and loop is requested
                player.currentTime(static_time);
                player.play();
            } else {
                videojs.log('Awww...over so soon?!');
                video.remove();
                video = null;
                sessionEnded();
            }
        });
    }
}