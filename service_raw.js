function raw_main() {
    console.log('>> inside audio_main');
    console.log(link_url);
    console.log(parameters);
    //---------------------------
    let href = decodeURI(link_url.href);
    raw_call(href);
}

function raw_call(url) {
    console.log(url);
    iframe.setAttribute('src', url);
    console.log(iframe);
}