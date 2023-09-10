function mixcloud_main() {
    console.log('>> inside mixcloud_main');
    console.log(link_url);
    console.log(packet.param);
    //---------------------------
    let video_reg = /\/([\w-]+)\/([\w-]+)\/?$/i;
    //---------------------------
    let href = decodeURI(link_url.href);
    let this_url = '';
    //---------------------------
    let username = '';
    let streamname = '';
    //---------------------------
    if (video_reg.test(href)) {
        let matches = href.match(video_reg);
        if (matches.length >= 3) {
            if (matches[1].toLowerCase() == 'live') {
                username = matches[2] || '';
            } else {
                username = matches[1] || '';
                streamname = matches[2] || '';
            }
        } else {
            script_direct();
        }
    }
    //---------------------------
    let t_ = parseInt(link_url.searchParams.get('t')) || parseInt(link_url.searchParams.get('time')) || 0;
    if ('t' in packet.param) { t_ += (parseInt(packet.param['t']) || 0); }

    if (username && streamname) { //if its not live...
        this_url = `https://www.mixcloud.com/widget/iframe/?feed=/${username}/${streamname}/`;
        // this_url = `https://www.mixcloud.com/widget/iframe/?feed=/0/0/`;
        iframe.setAttribute('src', this_url);
        if (!mixcloud_promise) { mixcloud_promise = mixcloud_initialization(); }
        mixcloud_promise.then(() => {
            player = Mixcloud.PlayerWidget(document.getElementById("video-iframe"));
            player.ready.then(function() {
                player.events.ended.on(() => {
                    if (quedPacket.length > 0 || !('loop' in packet.param)) {
                        sessionEnded();
                    } else {
                        player.seek(0);
                        player.play();
                    }
                });
                mixcloud_call(t_);
            });
        });
    } else {
        script_direct();
    }
}

function mixcloud_call(time) {
    console.log('>> inside mixcloud_call');
    // player.load(`/${username}/${streamname}/`, true);
    player.play();
    player.setOption('hide_cover', true);
    if (time != 0) { player.seek(time); }
}

let mixcloud_promise = null;

function mixcloud_initialization() {
    return new Promise((resolve, reject) => {
        let tag = document.createElement('script');
        tag.id = 'mixcloud-script';
        tag.src = 'https://widget.mixcloud.com/media/js/widgetApi.js';
        tag.async = true;
        tag.onload = () => {
            resolve();
        };
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        console_('___ Mixcloud Initialization...');
    });

}