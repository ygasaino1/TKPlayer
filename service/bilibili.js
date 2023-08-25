function bilibili_main() {
    console.log('>> inside bilibili_main');
    console.log(link_url);
    console.log(packet.param);
    //---------------------------
    let video_reg = /\/video\/(\w+)|bvid=(\w+)/i;
    //---------------------------
    let href = decodeURI(link_url.href);
    let this_url = '';
    //---------------------------
    let video_id = '';
    //---------------------------
    if (video_reg.test(href)) {
        let matches = href.match(video_reg);
        video_id = matches[1] || matches[2] || '';
    }
    //---------------------------
    let t_ = parseInt(link_url.searchParams.get('t')) || parseInt(link_url.searchParams.get('time')) || 0;
    if ('t' in packet.param) { t_ += (parseInt(packet.param['t']) || 0); }

    this_url = `https://player.bilibili.com/player.html?&bvid=${video_id}&page=1&autoplay=1&t=${t_}`;
    bilibili_call(this_url);
}

function bilibili_call(url) {
    console.log(url);
    iframe.setAttribute('src', url);
    console.log(iframe);
}