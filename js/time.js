var globalTime = {
    absolute: 0,
    relative: 0,
    scale: 1.,
    getAbsolute: function () { return this.absolute; },
    getRelative: function () { return this.relative; }
};

window.setInterval(() => {
    globalTime.relative += 0.001 * globalTime.scale;
    globalTime.absolute += 0.001;
}, 10);