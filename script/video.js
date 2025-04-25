player = null;

function video_main() {
    console.log('>> inside video_main');
    console.log(link_url);
    console.log(packet.param);
    //---------------------------
    let href = decodeURI(link_url.href);
    //---------------------------
    let html = `<video-js id="my-video" class="video-js" style="position: absolute; top:0; left:0; height:100%; width:100%" autoplay preload="auto"></video-js>`;
    video = htmlToElement(html);
    console.log(video);
    v_container.appendChild(video);
    let video_parameters = null;
    video_parameters = packet.param;
    let static_time = 0;

    //---------------------------
    log = 'Video Loading...';
    console_(log);

    //---------------------------
    player = videojs(document.querySelector('#my-video'));
    let types = {
        'm3u8': 'application/x-mpegURL',
        'mp4': 'video/mp4',
        'm4v': 'video/mp4',
        'webm': 'video/webm',
        'ogv': 'video/ogg'
    }
    let src_url = href;
    let extension = '';
    let src_type = '';

    let include_check_found = false;
    Object.keys(types).forEach(t => {
        if (!include_check_found && src_url.toLowerCase().includes(t)) {
            extension = t;
            include_check_found = true;
        }
    });

    let param_check_found = false;
    Object.keys(types).forEach(p => {
        if (!param_check_found && p in packet.param) {
            extension = p;
            param_check_found = true;
        }
    });

    if (extension in types) {
        src_type = types[extension];

        ////---------------------------
        player.ready(function () {
            //
            console.log(`VideoJs is Ready...`);
            console_(`___ [${src_type}]`);
            //
            console.log(`___ [${src_type}]`);
            console.log(`[SRC] ${src_url}`);
            //
            let src_obj = {
                type: src_type,
                src: src_url
            };
            console.log(src_obj);
            player.src(src_obj);

            let url = new URL(href);
            let t_ = parseInt(url.searchParams.get('t')) || parseInt(url.searchParams.get('time')) || 0;
            static_time = t_;
            if ('t' in packet.param) { t_ += (parseInt(packet.param['t']) || 0); }
            this.currentTime(t_);
        });
    }
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