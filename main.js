let instance = 0;
let debug_zIndex = 1;
let debug_opacity = 0.8;
loc_url = new URL(location);

function main() {
    //--------------------------- LOCATION TEMPLATE
    //location.com/#link.com?abc#hash#param1&param2
    console.log(hash['value']);
    let matches = hash['value'].match(/(.*)#([^#]*)$|.*/i);
    hash['value'] = matches[1] || matches[0];
    let temp_url = new URL(`http://a?${matches[2]||''}`);
    let link = hash['value'];
    //--------------------------- RE-FILL DATA
    parameters = {};
    [...temp_url.searchParams.keys()].forEach(k => {
        parameters[k] = temp_url.searchParams.get(k);
    });
    //--------------------------- LOG
    if (hash['key'] == 'link') {
        log = `...REQUEST/Video`;
    } else if (hash['key'] == 'radio') {
        log = `...REQUEST/Radio`;
    }
    if ('who' in parameters) { log += `@${parameters['who']}`; }
    console_(log);
    //--------------------------- CLEANUP
    restyle();
    cleanup();
    //---------------------------
    try {
        link_url = null;
        link_url = new URL(link);
        log = `URL [${link_url.protocol}//][${link_url.host}][${link_url.pathname}][${link_url.search}][${link_url.hash}] -${JSON.stringify(parameters)}`;
        console_(log);
        pre_hub();
    } catch (e) {
        console.log('URL Failed');

        if (link_url == null) { console_(`URL ${hash['value']}`) };
        console_(e);
        console_('...URL Failed');
    }
}

function restyle() {
    if ('debug' in parameters) { console_div.style.zIndex = debug_zIndex; } else { console_div.style.zIndex = 0; }
    if (hash['key'] == 'link') {
        console_div_inner.style.backgroundColor = `rgb(0,0,0,${debug_opacity})`;
    } else if (hash['key'] == 'radio') {
        { console_div_inner.style.backgroundColor = `rgb(0,0,0,0.0)`; }
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
    if (instance > 0 && !('noreload' in parameters)) { window.location.reload(); }
    if (hash['key'] == 'link') {
        instance += 1;
        b_iframe.setAttribute('src', '');
        video_hub();
    } else if (hash['key'] == 'radio') {
        b_iframe.setAttribute('src', 'flow\\index.html');
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
        script_direct();
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
    } else if (hash['key'] == 'debug') {
        if (console_div.style.zIndex == 0) {
            console_div.style.zIndex = debug_zIndex;
        } else if (console_div.style.zIndex == debug_zIndex) {
            console_div.style.zIndex = 0;
        }
    } else if (['link', 'radio'].includes(hash['key'])) { //time
        main();
    }
}

getHash();
main();
// visual();