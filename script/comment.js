function cmd_comment(msg) {
    let duraion = 7000;
    let iter = 1;
    if (msg.toLowerCase().startsWith("waa", 5)) {
        iter = 3;
        msg = msg.replace(msg.substring(5, 9), "");
    }
    for (let step = 0; step < iter; step++) {
        let a = $(`<p id="back">${msg}</p>`);
        let b = $(`<p id="front">${msg}</p>`);
        let top = Math.random() * (window.innerHeight - 200);
        let offset = 0;
        if (step > 0) {
            offset = Math.random() * (1000); //Looped msg offset
        }
        a.css('position', 'absolute');
        a.css('left', window.innerWidth + offset);
        a.css('top', top);
        a.css('white-space', 'pre');

        b.css('position', 'absolute');
        b.css('left', window.innerWidth + offset);
        b.css('top', top);
        b.css('white-space', 'pre');


        a.appendTo('body');
        b.appendTo('body');

        a.animate({
            left: a.width() * -1
        }, duraion, 'linear', function() {
            a.remove();
        });
        b.animate({
            left: b.width() * -1
        }, duraion, 'linear', function() {
            b.remove();
        });
    }
}