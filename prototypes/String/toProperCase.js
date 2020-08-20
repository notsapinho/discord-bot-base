module.exports = function (option = false) {
    return option
        ? this.split(" ")
              .map((str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase())
              .join(" ")
        : this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};
