module.exports = function () {
    return this[Math.floor(Math.random() * this.length)];
};
