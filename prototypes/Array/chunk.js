module.exports = function (chunkSize) {
    const R = [];
    for (let i = 0; i < this.length; i += chunkSize) R.push(this.slice(i, i + chunkSize));
    return R;
};
