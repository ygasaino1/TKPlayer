function vimeo_main() {
    console.log('>> inside vimeo_main');
    console.log(link_url);
    console.log(packet.param);
    let this_url = '';

    video_reg = /\/(\w+)[^\/]*$/i;
    //---------------------------
    let href = decodeURI(link_url.href);
    let video_id = '';
    //---------------------------
    if (video_reg.test(href)) {
        let matches = href.match(video_reg);
        video_id = matches[1] || matches[2] || '';
        console.log(`vimeo@video_id: ${video_id}`);
    }
    //---------------------------
    if ('loop' in packet.param) { // loop
        this_url = `https://player.vimeo.com/video/${video_id}?autoplay=1&loop=1&autopause=0`;
    } else {
        this_url = `https://player.vimeo.com/video/${video_id}?autoplay=1`;
    }
    //---------------------------
    vimeo_call(this_url);
}

function vimeo_call(url) {
    console.log(url);
    iframe.setAttribute('src', url);
    console.log(iframe);
}