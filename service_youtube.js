function YouTubeGetID(v) {
    v = v.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (v[2] !== undefined) ? v[2].split(/[^0-9a-z_\-]/i)[0] : v[0];
}

function youtube_main() {
    console.log('>> inside youtube_main');
    console.log(link_url);
    console.log(parameters);

    if ('list' in parameters || link_url.pathname.toLowerCase().includes('videoseries')) { // list
        let this_url = '';
        //---------------------------
        let search = decodeURI(link_url.search);
        if (!search.includes('list=LL') && !search.toLowerCase().includes('start_radio=1')) {
            //---------------------------
            let list_id_ = '';
            if (link_url.searchParams.has('playlist')) { list_id_ = link_url.searchParams.get('playlist') }
            if (link_url.searchParams.has('list')) { list_id_ = link_url.searchParams.get('list') }
            //---------------------------
            if ('loop' in parameters) { // loop
                this_url = `https://www.youtube.com/embed/videoseries?list=${list_id_}&enablejsapi=1&controls=0&loop=1&autoplay=1`;
            } else {
                this_url = `https://www.youtube.com/embed/videoseries?list=${list_id_}&enablejsapi=1&controls=0&autoplay=1`;
            }
            //---------------------------
            youtube_call(this_url);
        }
    } else { // single
        let this_url = '';
        //---------------------------
        let id_ = YouTubeGetID(decodeURI(link_url.href));
        console.log(`youtube@video_id: ${id_}`);
        //---------------------------
        let t_ = parseInt(link_url.searchParams.get('t')) || parseInt(link_url.searchParams.get('time')) || 0;
        if ('t' in parameters) { t_ += (parseInt(parameters['t']) || 0); }
        //---------------------------
        if ('loop' in parameters) { // loop
            this_url = `https://www.youtube.com/embed/${id_}?playlist=${id_}&enablejsapi=1&controls=0&loop=1&autoplay=1&start=${t_}`;
        } else { // once
            this_url = `https://www.youtube.com/embed/${id_}?enablejsapi=1&controls=0&autoplay=1&start=${t_}`;
        }
        //---------------------------
        youtube_call(this_url);
    }
}

function youtube_call(url) {
    console.log(url);
    iframe.setAttribute('src', url);
    console.log(iframe);
}