function radio_main() {
    console.log('>> inside audio_main');
    console.log(url);
    console.log(parameters);
    //---------------------------
    let href = decodeURI(url.href);

    // icon.textContent = '🖲';
    // text.textContent = 'TKRadio';
    // b_container.style.visibility = 'visible';

    radio_call(href);

}

function radio_call(url) {
    log = 'Radio Loading...';
    console_(log);

    console.log(url);
    audio.setAttribute('src', url);
    audio.play();
    console.log(audio);
}