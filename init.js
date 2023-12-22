// let grid = document.querySelector('#grid');
// let vis_div = document.querySelector('#cont2');
// let canvas = document.querySelector('canvas');

let player = null;

let iframe = document.querySelector('#video-iframe');
let iframe_temp = iframe.cloneNode();
let v_container = document.querySelector('#vid-container');
let t_container = document.querySelector('#twitch-container');

let video = null;
let b_container = document.querySelector('#back-container');
let b_iframe = document.querySelector('#back-iframe');


let audio = document.querySelector('audio');

let loc_url;
let link_url = null;

//////////////     //////////////
///        ///     ///        ///
///        ///     ///        ///
///        ///     ///        ///
//////////////     //////////////

//////////////
///        ///     Just a Break
///        ///     Betweem
///        ///     My Codes...
//////////////             _Tiki -----------------> DEBUG CONSOLE SECTION

let log = '';
let console_input = document.querySelector('#console-input');
let console_div = document.querySelector('#console');
let console_div_inner = document.querySelector('#console-flex');
let debug_cl_default = '#ffd3dc';
let debug_cl_warning = '#00b1ff';

let timeoutID_0;
let debug_duration = 1000;
let debug_zIndex = 100;
let debug_opacity = 0.8;
let i_want_debug = false;

// log = `REQUEST/Video<br>URL [${url.protocol || ''}//][${url.host || ''}][${url.pathname || ''}][${url.search || ''}][${url.hash || ''}]`;
function console_(log_, color = debug_cl_default) {
    let this_ = htmlToElement(`<div class="console" style="color: ${color}">${log_}</div>`);
    console_input.appendChild(this_);
    while (console_div.scrollHeight > console_div.clientHeight && console_input.childNodes.length > 2) {
        console_input.childNodes[1].remove()
    }
}

function showConsole() {
    // -------------
    console_div.style.zIndex = debug_zIndex;
    if (!i_want_debug) {
        clearTimeout(timeoutID_0);
        timeoutID_0 = setTimeout(() => { console_div.style.zIndex = '0'; }, debug_duration);
    }
}

//////////////     //////////////
///        ///     ///        ///
///        ///     ///        ///
///        ///     ///        ///
//////////////     //////////////

//////////////
///        ///     Just a Break
///        ///     Betweem
///        ///     My Codes...
//////////////             _Tiki