//&enablejsapi=1
let apiKey = `AIzaSyASq2_wSS45nCkxTy71WW5CKAhPzRn6pHU`;

function YouTubeGetID(v) {
    v = v.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (v[2] !== undefined) ? v[2].split(/[^0-9a-z_\-]/i)[0] : v[0];
}

function youtube_main() {
    console.log('>> inside youtube_main');
    console.log(link_url);
    console.log(parameters);
    //---------------------------
    let href = decodeURI(link_url.href);
    let this_url = '';
    let list_id = '';
    let video_id = '';
    if ('list' in parameters || link_url.pathname.toLowerCase().includes('videoseries')) { // list
        //---------------------------
        if (!href.includes('list=LL') && !href.toLowerCase().includes('start_radio=1')) {
            //---------------------------
            if (link_url.searchParams.has('playlist')) { list_id = link_url.searchParams.get('playlist') }
            if (link_url.searchParams.has('list')) { list_id = link_url.searchParams.get('list') }
            //---------------------------
            if ('loop' in parameters) { // loop
                this_url = `https://www.youtube.com/embed/videoseries?list=${list_id}&controls=0&loop=1&autoplay=1`;
            } else {
                this_url = `https://www.youtube.com/embed/videoseries?list=${list_id}&controls=0&autoplay=1`;
            }
            try {
                fetch(`https://www.googleapis.com/youtube/v3/playlists?id=${list_id}&key=${apiKey}&fields=items(snippet(title))&part=snippet`)
                    .then(res => res.json())
                    .then(out => {
                        console.log(out);
                        document.title = out['items'][0]['snippet']['title'];
                    })
            } catch {}
        }
    }
    if (list_id == '') { // single
        //---------------------------
        video_id = YouTubeGetID(href);
        console.log(`youtube@video_id: ${video_id}`);
        //---------------------------
        let t_ = parseInt(link_url.searchParams.get('t')) || parseInt(link_url.searchParams.get('time')) || 0;
        if ('t' in parameters) { t_ += (parseInt(parameters['t']) || 0); }
        //---------------------------
        if ('loop' in parameters) { // loop
            this_url = `https://www.youtube.com/embed/${video_id}?playlist=${video_id}&controls=0&loop=1&autoplay=1&start=${t_}`;
        } else { // once
            this_url = `https://www.youtube.com/embed/${video_id}?controls=0&autoplay=1&start=${t_}`;
        }
        try {
            fetch(`https://www.googleapis.com/youtube/v3/videos?id=${video_id}&key=${apiKey}&fields=items(snippet(title))&part=snippet`)
                .then(res => res.json()).then(out => {
                    console.log(out);
                    document.title = out['items'][0]['snippet']['title'];
                })
        } catch {}
    }
    if ('mute' in parameters) {
        this_url += '&mute=1';
    }
    youtube_call(this_url);
}

function youtube_call(url) {
    console.log(url);
    iframe.setAttribute('src', url);
    console.log(iframe);
}