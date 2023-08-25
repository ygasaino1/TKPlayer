function script_direct() {
    console.log('>> inside direct');
    console.log(link_url);
    console.log(packet.param);
    //---------------------------
    let href = decodeURI(link_url.href);
    script_call(href);
}

function script_call(url) {
    console.log(url);
    window.location.href = url;
}