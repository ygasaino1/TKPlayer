function wistia_main() {
    console.log('>> inside wistia_main');
    console.log(link_url);
    console.log(packet.param);
    //---------------------------
    let href = decodeURI(link_url.href);
    let this_url = '';

    wistia_call(this_url);
}

function wistia_call(url) {
    console.log(url);
    iframe.setAttribute('src', url);
    console.log(iframe);
}