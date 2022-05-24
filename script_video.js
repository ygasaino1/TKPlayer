let player = null;

function video_main() {
    console.log('>> inside video_main');
    console.log(link_url);
    console.log(parameters);
    //---------------------------
    let href = decodeURI(link_url.href);
    //---------------------------
    let html = `<video id="vid" preload="auto" class="vjs-default-skin" autoplay><source src=${href} ></video>`;
    video = htmlToElement(html);
    console.log(video);
    v_container.appendChild(video);
    //---------------------------

    v_container.style.visibility = 'visible';

    //---------------------------
    var options = {};
    player = videojs(video, options, function onPlayerReady() {
        videojs.log('Your player is ready!');

        // In this context, `this` is the player that was created by Video.js.
        this.play();

        // How about an event listener?
        this.on('ended', function() {
            videojs.log('Awww...over so soon?!');
            video.remove();
            video = null;
        });

        //---------------------------
        let t_ = parseInt(link_url.searchParams.get('t')) || parseInt(link_url.searchParams.get('time')) || 0;
        if ('t' in parameters) { t_ += (parseInt(parameters['t']) || 0); }
        this.currentTime(time);
    });
}