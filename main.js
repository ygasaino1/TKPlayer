function main() {
    let link = hash['value'];
    //--------------------------- RE-FILL DATA
    [...loc_url.searchParams.keys()].forEach(k => {
        parameters[k] = loc_url.searchParams.get(k);
    });
    //--------------------------- RE-STYLE
    // b_container.style.visibility = 'hidden';
    // if (hash['key'] == 'link' && audio.getAttribute('src') == '') {
    //     grid.style.gridTemplateColumns = '15fr 0fr';
    // } else if (hash['key'] == 'radio') { grid.style.gridTemplateColumns = '15fr 1fr'; };
    //--------------------------- CLEANUP
    cleanup();
    //---------------------------
    try {
        link_url = new URL(link);
        pre_hub();
    } catch {
        console.log('URL Failed');
        console_('...URL Failed');
    }
}

function cleanup() {
    if (hash['key'] == 'link') {
        { //1.1. loading a video so: cleaning videos first
            if (video != null) {
                video.remove();
                video = null;
            }
            iframe.setAttribute('src', '');
        }
        //1.2. ...
        if (!('mute' in parameters)) {
            audio.setAttribute('src', '');
        }
    } else if (hash['key'] == 'radio') {
        audio.setAttribute('src', '');
    }
}

function pre_hub() {
    if (hash['key'] == 'link') {
        log = `...REQUEST/Video<br>URL [${link_url?link_url.protocol:'-'}//][${link_url?link_url.host:'-'}][${link_url?link_url.pathname:'-'}][${link_url?link_url.search:'-'}][${link_url?link_url.hash:'-'}]`;
        console_(log);
        video_hub();
    } else if (hash['key'] == 'radio') {
        log = `...REQUEST/Radio<br>URL [${link_url?link_url.protocol:'-'}//][${link_url?link_url.host:'-'}][${link_url?link_url.pathname:'-'}][${link_url?link_url.search:'-'}][${link_url?link_url.hash:'-'}]`;
        console_(log);
        radio_hub();
    }
}

let refs = {
    'youtube': /(.*youtube\..*)|(.*youtu\.be.*)/i,
    'twitch': /.*\.twitch\..*/i,
    'vimeo': /.*vimeo\.\w+\//i,
    'soundcloud': /\w*.?soundcloud\.\w+/i,
    'bilibili': /\.bilibili\./i,
    'zeno': /zeno/i,

    'video': /\.mp4|\.m3u8|\.webm|\.ogv/i,

}

function video_hub() {
    if (refs['youtube'].test(link_url.host)) {
        youtube_main();
    } else if (refs['twitch'].test(link_url.host)) {
        twitch_main();
    } else if (refs['vimeo'].test(link_url.host)) {
        vimeo_main();
    } else if (refs['soundcloud'].test(link_url.host)) {
        soundcloud_main();
    } else if (refs['bilibili'].test(link_url.host)) {
        bilibili_main();
    } else if (refs['zeno'].test(decodeURI(link_url.host))) {
        zeno_main();
    } else if (refs['video'].test(decodeURI(link_url.href))) {
        video_main();
    } else {
        raw_main();
    }
}

function radio_hub() {
    radio_main();
}

window.addEventListener("hashchange", () => {
    hashchange();
});

function hashchange() {
    getHash();
    if (hash['key'] == 'comment') { //comment
        comment(hash['value']);
        // history.pushState(null, null, ' ');
    } else if (['link', 'radio'].includes(hash['key'])) { //time
        main();
    }
}

getHash();
main();
// visual();