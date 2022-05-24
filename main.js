let loc_url = new URL(location);
let link_url = null;
let parameters = {};
let hash = {};

function main() {
    let link = hash['value'];
    try {
        link_url = new URL(link);
        [...loc_url.searchParams.keys()].forEach(k => {
            if (k.toLowerCase() != 'open') { parameters[k] = loc_url.searchParams.get(k); }
        });
        //---------------------------
        //CLEAN-UP: we dont want a video and an iframe at the same time.
        if (video != null) {
            video.remove();
            video = null;
        }
        b_container.style.visibility = 'hidden';
        audio.setAttribute('src', '');
        iframe.setAttribute('src', '');
        //---------------------------
        if (hash['key'] == 'link') {
            video_hub();
        } else if (hash['key'] == 'radio') {
            radio_hub();
        }
    } catch {
        console.log('URL Failed');
    }
}

function getHash() {
    let sep = '>';
    let h = decodeURI(location.hash).substring(1);
    let indexOf = h.indexOf(sep);
    hash = {
        key: indexOf != -1 ? h.slice(0, h.indexOf(sep)) : h,
        value: indexOf != -1 ? h.slice(h.indexOf(sep) + sep.length) : ''
    }
}
window.addEventListener("hashchange", () => {
    getHash();
    if (hash['key'] == 'comment') { //comment
        comment(hash['value']);
        // history.pushState(null, null, ' ');
    } else if (hash['key'] in ['link', 'radio']) { //time
        main();
    }
});

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
    }
}

function radio_hub() {
    radio_main();
}
//...

getHash();
main();