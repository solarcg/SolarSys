var globalTime = {
    absolute: 0,
    relative: 0,
    scale: 1.,
    getAbsolute: function () { return this.absolute; },
    getRelative: function () { return this.relative; }
};

window.setInterval(() => {
    globalTime.relative += 0.01 * globalTime.scale;
    globalTime.absolute += 0.01;
}, 10);