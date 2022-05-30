function twitch_main() {
    console.log('>> inside twitch_main');
    console.log(link_url);
    console.log(parameters);
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
    if ('t' in parameters) { t_ += (parseInt(parameters['t']) || 0); }
    // if (hash['key'] == 't') { t_ += (parseInt(hash['value']) || 0); }
    this_url += `&time=${t_}`;
    try {
        let body_ = "";
        fetch(href).then(res => res.text()).then(out => body = out).catch(e => console.log(e));
        let body_dom_ = new DOMParser().parseFromString(a, "text/html");
        document.title = body_dom_.title;
    } catch {}
    twitch_call(this_url);
}

function twitch_call(url) {
    // use the html elements and ...
    console.log(url);
    iframe.setAttribute('src', url);
    console.log(iframe);
}