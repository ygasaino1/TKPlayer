function raw_main() {
    console.log('>> inside audio_main');
    console.log(url);
    console.log(parameters);
    //---------------------------
    let href = decodeURI(url.href);
    raw_call(href);
}

function raw_call(url) {
    console.log(url);
    iframe.setAttribute('src', url);
    console.log(iframe);
}