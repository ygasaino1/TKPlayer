let homepage = "https://prrr-001.glitch.me/";
let blankpage = window.location.href;
let blackurl = '';
//.....

let instance = 0;
loc_url = new URL(location);

let video_service_custom = {
    // 'param1': param1_main_function,
};
let video_service = {
    'youtube': /(.*youtube\..*)|(.*youtu\.be.*)/i,
    'twitch': /.*\.twitch\..*/i,
    'vimeo': /.*vimeo\.\w+\//i,
    'soundcloud': /\w*.?soundcloud\.\w+/i,
    'bilibili': /\.bilibili\./i,
    'zeno': /zeno/i,
    'mixcloud': /\.mixcloud\./i,

    'video': /\.mp4|\.m3u8|\.webm|\.ogv/i,
}

let novideo_service = {
    'radio': radio_main,
};

function cmd_open_v2() {

    let link = packet.body;
    //--------------------------- LOG
    log = `...REQUEST`;
    if (packet.id != "") { log += `@${packet.id}`; }
    console_(log);
    //---------------------------
    try {
        link_url = null;
        if (link == 'off') {
            link = blankpage;
            link_url = new URL(link);
            console_(`URL off`);
        }
        else if (link == 'homepage') {
            link = homepage;
            link_url = new URL(link);
            console_(`URL homepage`);
        } else {
            link_url = new URL(link);
            if (link_url.host == location.host || '-' in packet.param) {
                log = `URL [*][*][*][*][*] -{___}`
            } else {
                log = `URL [${link_url.protocol}//][${link_url.host}][${link_url.pathname}][${link_url.search}][${link_url.hash}] -${JSON.stringify(packet.param)}`;
            }
            console_(log);
        }
        prehub();
        // -------------
        showConsole();
    } catch (e) {
        console.log('URL Failed');
        if (link_url == null) { console_(`URL ${packet.body} -${JSON.stringify(packet.param)}`, debug_cl_warning) };
        console_(e, debug_cl_warning);
        console_('...URL Failed', debug_cl_warning);
        // -------------
        showConsole();
    }
}

function prehub() {
    if (['radio'].some(p => p in packet.param)) {
        reload_check('NOVIDEO');
        //--> if going to add a blacklist of urls, this spot may be the best spot
        //<--
        cleanup('NOVIDEO');
        restyle('NOVIDEO');
        //-->
        hub_novideo();
    } else {
        reload_check('VIDEO');
        cleanup('VIDEO');
        restyle('VIDEO');
        //-->
        hub_video();
    }
}

function reload_check(v) {
    if (instance > 0 && !('noreload' in packet.param)) { window.location.reload(); }
    if (v == 'VIDEO') { instance += 1; }
}

function cleanup(v) {
    if (v == 'VIDEO') {
        { //1.1. loading a video so: cleaning videos first
            if (video != null) {
                video.remove();
                video = null;
            }
            iframe.setAttribute('src', '');
        }
        //1.2. ...
        if (!('mute' in packet.param)) {
            audio.setAttribute('src', '');
        }
    } else if (v == 'NOVIDEO') {
        audio.setAttribute('src', '');
    }
}

function restyle(v) {
    if ('debug' in packet.param) { console_div.style.zIndex = debug_zIndex; } else { console_div.style.zIndex = 0; }
    if (v == 'VIDEO') {
        console_div_inner.style.backgroundColor = `rgb(0,0,0,${debug_opacity})`;
        b_iframe.setAttribute('src', '');
    } else if (v == 'NOVIDEO') {
        console_div_inner.style.backgroundColor = `rgb(0,0,0,0.0)`;
        b_iframe.setAttribute('src', 'flow\\index.html');
    }
}

function hub_video() {
    let video_custom_param_ = Object.keys(video_service_custom).filter(p => p in packet.param)[0];
    if (video_custom_param_ != undefined) { // SPECIAL
        video_service_custom[video_custom_param_]();
    } else if (video_service['youtube'].test(link_url.host)) {
        youtube_main();
    } else if (video_service['twitch'].test(link_url.host)) {
        twitch_main();
    } else if (video_service['vimeo'].test(link_url.host)) {
        vimeo_main();
    } else if (video_service['soundcloud'].test(link_url.host)) {
        soundcloud_main();
    } else if (video_service['bilibili'].test(link_url.host)) {
        bilibili_main();
    } else if (video_service['zeno'].test(decodeURI(link_url.host))) {
        zeno_main();
    } else if (video_service['mixcloud'].test(decodeURI(link_url.host))) {
        mixcloud_main();
    } else if (video_service['video'].test(decodeURI(link_url.href))) {
        video_main();
    } else { // SUPER SPECIAL
        script_direct();
    }
}

function hub_novideo() {
    let param_ = Object.keys(novideo_service).filter(p => p in packet.param)[0];
    if (param_ != undefined) {
        novideo_service[param_]();
    }
}

function cmd_debug() {
    if (console_div.style.zIndex == '0') {
        i_want_debug = true;
        console_div.style.zIndex = debug_zIndex;
    } else {
        i_want_debug = false;
        console_div.style.zIndex = '0';
    }
}

window.addEventListener("hashchange", () => {
    hashchange(false);
});

let packet = {
    func: 'default',
    body: '',
    param: {},
    id: '',
    extra: {}
};

function isBlocked2() {
    let check = false;
    let currentUser;
    let currentUrl;
    /* todo:
    1. fetch a url for its string content
    2. put the output inside an array spliting by lines
    3. raw inputs in each line are formatted like this: [USER/URL]:[userValue/urlAddress]. example, USER:Tiki-8590 \n URL:www.google.com
    4. url addresses may have wild cards like this example in the raw input. example, www.google.com/* so convert all of the urls into regex type.
    5. make an object like this template
    {
        url:[],
        user:[]
    }
    for each item in array, fill the inputs in their respectable place.
    6. use regex and check if either current user or current url is inside the block object list by checking them in the list one by one. consider that
    we may have wild cards inside the url address raw input.
    then set check to true if you found any match in regex or false if not.
    */
    return check;
}

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

async function isBlocked(blockUrlSource) {
    let check = false;
    if (!blockUrlSource) { return false; }
    if (!isValidURL(blockUrlSource)) { return false }
    let currentUser = packet.id ?? "";
    let currentUrl = packet.body ?? "";
    if (currentUrl == null || undefined || "") {
        currentUrl = "";
    } else {
        if (!currentUrl.startsWith('http://') && !currentUrl.startsWith('https://')) {
            currentUrl = 'https://' + currentUrl; // Prepend with http://
        }
        currentUrl = decodeURI(currentUrl);
        currentUrl = new URL(currentUrl).href;
    }

    // Function to convert wildcard URL to regex
    const urlToRegex = (url) => {
        // Allow both case-insensitive and trailing slash variations
        const regexString = url
            .replace(/\./g, '\\.')
            .replace(/\*/g, '.*')
            .replace(/\/?$/, '/?')
            .toLowerCase(); // Convert to lowercase for case insensitivity
        return new RegExp(`^${regexString}$`);
    };

    try {
        // Fetching URL for its string content (Assuming async operation)
        const response = await fetch(blockUrlSource);
        const content = await response.text();

        // Split content by lines
        const lines = content.split('\n');

        // Initialize block object
        const block = {
            url: [],
            user: []
        };

        // Parsing lines and filling block object
        lines.forEach(line => {
            const [type, value] = line.split(':');
            if (type.trim() === 'USER') {
                block.user.push(value.trim().toLowerCase());
            } else if (type.trim() === 'URL') {
                block.url.push(urlToRegex(value.trim()));
            }
        });
        console.log(block);

        // Check if current user or current url is blocked
        check = block.user.some(userRegex => {
            return userRegex.test(currentUser.toLowerCase());
        }) || block.url.some(urlRegex => {
            return urlRegex.test(currentUrl);
        });
    } catch (error) {
        console.error('Error fetching or parsing data:', error);
    }

    return check;
}

function hashchange(skipCheck) {
    if ((skipCheck == false) && (hashVerified() == false)) {
        history.pushState(null, null, ' ');
        return;
    }
    if (packet.func == 'comment') { //comment
        cmd_comment(packet.body);
    } else if (packet.func == 'debug') {
        cmd_debug();
    } else if (packet.func == 'default') {
        if ('que' in packet.param) {
            cmd_que();
        } else if ('cmd' in packet.param) {
            cmd_cmd();
        } else if ('help' in packet.param) {
            cmd_help();
        } else {
            cmd_open_v2();
        }
    }
    history.pushState(null, null, ' ');
}

async function hashVerified() {
    // #{ "overparam", "func", "body", "param", "id", "extra" }
    let h = decodeURI(location.hash).substring(1);
    console.log(`#${h}`);
    try {
        let obj = JSON.parse(h);
        let packet_temp = {
            overparam: {},
            func: 'default',
            body: '',
            param: {},
            id: '',
            extra: {},
            env: {}
        };
        let superUser = ['blockurl'];
        // this is filling up the packet object
        Object.keys(obj).forEach(key => {
            if (!superUser.includes(key.toLowerCase()) && key in packet_temp && obj[key] != null) { packet_temp[key] = obj[key]; }
        });
        // override params with overparams that are added by authorities(world owners)
        Object.keys(packet_temp.overparam).forEach(key => {
            if (superUser.includes(key.toLowerCase())) {
                packet_temp.env[key] = packet_temp.overparam[key];
            } else {
                packet_temp.param[key] = packet_temp.overparam[key];
            }
        });
        delete packet_temp.overparam;

        console.log("> Hash Verified.");
        console.log(packet);
        let isBlockedResult = await isBlocked(packet.env.blockurl);
        if (isBlockedResult) {
            history.pushState(null, null, ' ');
            return false;
        }
        else {
            packet = packet_temp;
            return true;
        }

        // }
    } catch (e) {
        return false;
    }
}

let quedPacket = [];

function cmd_que() {
    delete packet.param.que;
    packet.param['noreload'] = null;
    quedPacket.push(packet);
    log = `...QUE-REQUEST`;
    if (packet.id != "") { log += `@${packet.id}`; }
    console.log(log);
    console_(log);
    // -------------
    showConsole();
}

function sessionEnded() {
    console.log("> Session End!")
    if (quedPacket.length > 0) {
        packet = quedPacket.shift();
        hashchange(true);
    }
    else {
        console.log("Exit")
        // finished for real...
        if (video != null) {
            video.remove();
            video = null;
        }
        iframe.parentElement.replaceChild(iframe_temp, iframe);
    }
}

function cmd_cmd() {
    log = `...CMD-REQUEST`;
    if (packet.id != "") { log += `@${packet.id}`; }
    console_(log);

    // CMD SECURITY SECTION ------------>
    packet.body = cmd_cmd_security(packet.body);
    // <------------- CMD SECURITY SECTION

    try {
        let temp_cmd = `"use strict";player.${packet.body};`;
        Function(temp_cmd)()
        console.log(temp_cmd);
        console_(`CMD player.${packet.body}`);
        // -------------
        showConsole();
    } catch (e) {
        console.log('CMD Failed');
        console_(e, debug_cl_warning);
        console_('...CMD Failed', debug_cl_warning);
        // -------------
        showConsole();
    }
}

function cmd_cmd_security(str) {
    // Rules
    // 1. cant go beyond first ')'
    str = str.replace(/[;\.\s]/g, '');
    // 1. cant have ';' or '.' or white spaces or new lines ...
    str = str.substring(0, str.indexOf(')') == -1 ? str.length : str.indexOf(')') + 1);
    // 3. ',' is Allowed only when its between '(' and ')'
    let i = -1;
    while ((i = str.indexOf(',', i + 1)) != -1) {
        let p2 = str.indexOf(')', i);
        if (p2 == -1) {
            str = str.replaceAt(i, '');
            continue;
        }
        let p1 = str.indexOf('(', i);
        if (p1 != -1 && p1 < p2) {
            str = str.replaceAt(i, '');
            continue;
        }
        if (p1 == -1 && str.indexOf('(', 0) == -1) {
            str = str.replaceAt(i, '');
            continue;
        }
    }
    return str;
}

function cmd_help() {
    if (packet.body.toLowerCase() == 'youtube') {
        console_(JSON.stringify(youtube_cmds, null, 1));
        showConsole();
    }
}

iframe.style.visibility = 'visible';
v_container.style.visibility = 'visible';
hashchange(false);

// visual();