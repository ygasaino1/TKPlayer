let homepage = "https://prrr-001.glitch.me/";

let instance = 0;
let debug_zIndex = 1;
let debug_opacity = 0.8;
loc_url = new URL(location);

let video_service_custom = {
    // 'param1': func1,
};
let video_service = {
    'youtube': /(.*youtube\..*)|(.*youtu\.be.*)/i,
    'twitch': /.*\.twitch\..*/i,
    'vimeo': /.*vimeo\.\w+\//i,
    'soundcloud': /\w*.?soundcloud\.\w+/i,
    'bilibili': /\.bilibili\./i,
    'zeno': /zeno/i,

    'video': /\.mp4|\.m3u8|\.webm|\.ogv/i,
}

let novideo_service = {
    'radio': radio_main,
};

function cmd_open() {
    //--------------------------- LOCATION TEMPLATE
    //location.com/#link.com?abc#hash#param1&param2
    let matches = hash['value'].match(/(.*)#([^#]*)$|.*/i);
    hash['value'] = matches[1] || matches[0];
    //---------------------------
    let temp_url = new URL(`http://a?${matches[2] || ''}`);
    let link = hash['value'];
    //--------------------------- RE-FILL DATA
    parameters = {};
    [...temp_url.searchParams.keys()].forEach(k => {
        parameters[k] = temp_url.searchParams.get(k);
    });
    //--------------------------- LOG
    log = `...REQUEST`;
    if ('who' in parameters) { log += `@${parameters['who']}`; }
    console_(log);
    //---------------------------
    try {
        link_url = null;
        if (link == 'homepage') {
            link = homepage;
            link_url = new URL(link);
            console_(`URL ${hash['value']}`);
        } else {
            link_url = new URL(link);
            log = `URL [${link_url.protocol}//][${link_url.host}][${link_url.pathname}][${link_url.search}][${link_url.hash}] -${JSON.stringify(parameters)}`;
            console_(log);
        }
        prehub();
    } catch (e) {
        console.log('URL Failed');
        cmd_debug("woooo\\nwoooooooooooo.....");
        if (link_url == null) { console_(`URL ${hash['value']}`, debug_cl_warning) };
        console_(e, debug_cl_warning);
        console_('...URL Failed', debug_cl_warning);
    }
}

function prehub() {
    if (['radio'].some(p => p in parameters)) {
        reload_check('NOVIDEO');
        cleanup('NOVIDEO');
        restyle('NOVIDEO');
        //-->
        hub_novideo();
    } else {
        reload_check('VIDEO');
        cleanup('VIDEO');
        restyle('VIDEO');
        //-->
        hub_video();
    }
}

function reload_check(v) {
    if (instance > 0 && !('noreload' in parameters)) { window.location.reload(); }
    if (v == 'VIDEO') { instance += 1; }
}

function cleanup(v) {
    if (v == 'VIDEO') {
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
    } else if (v == 'NOVIDEO') {
        audio.setAttribute('src', '');
    }
}

function restyle(v) {
    if ('debug' in parameters) { console_div.style.zIndex = debug_zIndex; } else { console_div.style.zIndex = 0; }
    if (v == 'VIDEO') {
        console_div_inner.style.backgroundColor = `rgb(0,0,0,${debug_opacity})`;
        b_iframe.setAttribute('src', '');
    } else if (v == 'NOVIDEO') {
        console_div_inner.style.backgroundColor = `rgb(0,0,0,0.0)`;
        b_iframe.setAttribute('src', 'flow\\index.html');
    }
}

function hub_video() {
    let video_custom_param_ = Object.keys(video_service_custom).filter(p => p in parameters)[0];
    if (video_custom_param_ != undefined) { // SPECIAL
        video_service_custom[video_custom_param_]();
    } else if (video_service['youtube'].test(link_url.host)) {
        youtube_main();
    } else if (video_service['twitch'].test(link_url.host)) {
        twitch_main();
    } else if (video_service['vimeo'].test(link_url.host)) {
        vimeo_main();
    } else if (video_service['soundcloud'].test(link_url.host)) {
        soundcloud_main();
    } else if (video_service['bilibili'].test(link_url.host)) {
        bilibili_main();
    } else if (video_service['zeno'].test(decodeURI(link_url.host))) {
        zeno_main();
    } else if (video_service['video'].test(decodeURI(link_url.href))) {
        video_main();
    } else { // SUPER SPECIAL
        script_direct();
    }
}

function hub_novideo() {
    let param_ = Object.keys(novideo_service).filter(p => p in parameters)[0];
    if (param_ != undefined) {
        novideo_service[param_]();
    }
}

let debug_timeoutID;

function cmd_debug(msg, color = debug_cl_warning) {
    if (msg != '') { console_(decodeURI(msg).replaceAll('\\n', '<br>'), color) };
    console_div.style.zIndex = debug_zIndex;
    clearTimeout(debug_timeoutID);
    debug_timeoutID = setTimeout(() => { console_div.style.zIndex = 0; }, 7000);
}

// log = `REQUEST/Video<br>URL [${url.protocol || ''}//][${url.host || ''}][${url.pathname || ''}][${url.search || ''}][${url.hash || ''}]`;
function console_(log, color = debug_cl_default) {
    let this_ = htmlToElement(`<div class="console" style="color: ${color}">${log}</div>`);
    console_input.appendChild(this_);
}

window.addEventListener("hashchange", () => {
    hashchange();
});

function hashchange() {
    getHash();
    if (hash['key'] == 'open') { //time
        cmd_open();
    } else if (hash['key'] == 'comment') { //comment
        cmd_comment(hash['value']);
    } else if (hash['key'] == 'debug') {
        cmd_debug(hash['value']);
    }
    history.pushState(null, null, ' ');
}

// getHash();
// cmd_open();
hashchange();
// visual();