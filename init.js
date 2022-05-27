// let grid = document.querySelector('#grid');
// let vis_div = document.querySelector('#cont2');
// let canvas = document.querySelector('canvas');

let iframe = document.querySelector('#video-iframe');
let v_container = document.querySelector('#vid-container');
let video = null;
let b_container = document.querySelector('#back-container');
let b_iframe = document.querySelector('#back-iframe');
let console_div = document.querySelector('#console');
let console_div_inner = document.querySelector('#console-flex');
let debug_cl_default = '#ffd3dc';
let debug_cl_warning = '#00b1ff';

let audio = document.querySelector('audio');

let loc_url;
let link_url = null;
let parameters = {};
let hash = {};

let log = '';
let console_input = document.querySelector('#console-input');

function getHash() {
    let sep = '>';
    let h = decodeURI(location.hash).substring(1);
    let indexOf = h.indexOf(sep);
    hash = {
        key: indexOf != -1 ? h.slice(0, h.indexOf(sep)) : h,
        value: indexOf != -1 ? h.slice(h.indexOf(sep) + sep.length) : ''
    }
}

// log = `REQUEST/Video<br>URL [${url.protocol || ''}//][${url.host || ''}][${url.pathname || ''}][${url.search || ''}][${url.hash || ''}]`;
function console_(log, color = debug_cl_default) {
    let this_ = htmlToElement(`<div class="console" style="color: ${color}">${log}</div>`);
    console_input.appendChild(this_);
}