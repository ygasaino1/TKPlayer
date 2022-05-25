// let grid = document.querySelector('#grid');
// let vis_div = document.querySelector('#cont2');
// let canvas = document.querySelector('canvas');

let iframe = document.querySelector('iframe');
let v_container = document.querySelector('#vid-container');
let video = null;
let b_container = document.querySelector('#back-container');
let icon = b_container.querySelector('#icon');
let text = b_container.querySelector('#text');
let audio = document.querySelector('audio');

let loc_url = new URL(location);
let link_url = null;
let parameters = {};
let hash = {};

function getHash() {
    let sep = '>';
    let h = decodeURI(location.hash).substring(1);
    let indexOf = h.indexOf(sep);
    hash = {
        key: indexOf != -1 ? h.slice(0, h.indexOf(sep)) : h,
        value: indexOf != -1 ? h.slice(h.indexOf(sep) + sep.length) : ''
    }
}