// let twitch_player = null; -> used player instead, so i can control everything such as youtube or twitch using same container.!

// addEventListener(Twitch.Player.VIDEO_READY, setQuality);

function twitch_main() {
    console.log('>> inside twitch_main');
    console.log(link_url);
    console.log(packet.param);
    player = null;
    //---------------------------
    let channel_reg = /^.*www\.twitch\.tv\/([^\?\/]+)$|.*\/\?channel=([^&]*)/i;
    let video_reg = /.*\/\?video=(\w+)|.*\/videos\/([^?]*)/i;
    let collection_reg = /.*collection=(\w+)/i;
    //---------------------------
    let href = decodeURI(link_url.href);
    let this_url = '';
    //---------------------------
    let channel_id = '';
    let video_id = '';
    let collection_id = '';
    //---------------------------
    if (channel_reg.test(href)) {
        let matches = href.match(channel_reg);
        channel_id = matches[1] || matches[2] || '';
        console.log(`twitch@channel_id: ${channel_id}`);
    }
    if (video_reg.test(href)) {
        let matches = href.match(video_reg);
        video_id = matches[1] || matches[2] || '';
        console.log(`twitch@video_id: ${video_id}`);
    }
    if (collection_reg.test(href)) {
        let matches = href.match(collection_reg);
        collection_id = matches[1] || '';
        console.log(`twitch@collection_id: ${collection_id}`);
    }

    //---------------------------
    this_url = `https://player.twitch.tv/?parent=${loc_url.hostname}&autoplay=true`; //parent=ygasaino1.github.io
    if (channel_id != '') { this_url += `&channel=${channel_id}`; }
    if (video_id != '') { this_url += `&video=${video_id}`; }
    if (collection_id != '') { this_url += `&collection=${collection_id}`; }

    //---------------------------
    let t_ = 0;
    let t_raw = link_url.searchParams.get('t') || link_url.searchParams.get('time') || '';
    if (/^.*\D.*$/.test(t_raw)) {
        let matches = t_raw.match(/(\d*h)?(\d*m)?(\d*s)/i);
        t_ += parseInt(matches[1]) * 3600 || 0;
        t_ += parseInt(matches[2]) * 60 || 0;
        t_ += parseInt(matches[3]) || 0;
    } else {
        t_ = parseInt(t_raw) || 0;
    }
    if ('t' in packet.param) { t_ += (parseInt(packet.param['t']) || 0); }
    // if (hash['key'] == 't') { t_ += (parseInt(hash['value']) || 0); }
    this_url += `&time=${t_}`;

    // GETTING TITLE! BUT A FAILURE, WHO NEEDS IT, NVM
    // try {
    //     let body_ = "";
    //     fetch(href).then(res => res.text()).then(out => body = out).catch(e => console.log(e));
    //     let body_dom_ = new DOMParser().parseFromString(a, "text/html");
    //     document.title = body_dom_.title;
    // } catch {}

    let options = {
        autoplay: true,
        width: '100%',
        height: '100%',
        //parent: ['ygasaino1.github.come']
    };
    if (channel_id != '') { options.channel = channel_id; } else if (video_id != '') { options.video = video_id; } else if (collection_id != '') { options.collection = collection_id; }
    if (t_ != 0) { options.time = `${t_}`; }
    player = new Twitch.Player("twitch-container", options);
    player.addEventListener(Twitch.Player.VIDEO_PLAY, setTwitchQuality);
    player.addEventListener(Twitch.Player.ENDED, twitchEnded);
    // twitch_call(this_url);

}

// function twitch_call(url) {
//     // use the html elements and ...
//     console.log(url);
//     iframe.setAttribute('src', url);
//     console.log(iframe);
// }

function setTwitchQuality() {
    console.log("twitch: Play");
    player.removeEventListener(Twitch.Player.VIDEO_PLAY, setTwitchQuality);
    if (!('max' in packet.param)) { return; }
    let log = 'twitch: Setting quality...';
    console.log(log);
    console_(log);
    let bestQuality = 'Auto';
    log = `${player.getQualities().length} Qualities Present`;
    console.log(log);
    console_(log);
    if (player.getQualities().length > 1) {
        log = `${player.getQualities()[1].group}`;
        console.log('quality: ' + log);
        console_('quality: ' + log);
        player.setQuality(log);
    }
}

function twitchEnded() {
    sessionEnded();
}