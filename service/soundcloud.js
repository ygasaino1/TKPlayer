function soundcloud_main() {
    console.log('>> inside soundcloud_main');
    console.log(link_url);
    console.log(packet.param);
    //---------------------------
    let href = decodeURI(link_url.href);
    let this_url = `https://w.soundcloud.com/player/?url=${href}&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
    //---------------------------
    soundcloud_call(this_url);
}

function soundcloud_call(url) {
    console.log(url);
    iframe.setAttribute('src', url);
    console.log(iframe);
}