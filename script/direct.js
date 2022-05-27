function script_direct() {
    console.log('>> inside raw_main');
    console.log(link_url);
    console.log(parameters);
    //---------------------------
    let href = decodeURI(link_url.href);
    script_call(href);
}

function script_call(url) {
    console.log(url);
    iframe.setAttribute('src', url);
    console.log(iframe);
}