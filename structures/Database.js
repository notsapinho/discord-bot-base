const mongoose = require("mongoose");
const { requireDir } = require("../utils");
const consola = require("consola");
require("dotenv/config");

mongoose.connect(
    process.env.MONGO,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err) => {
        if (err) return console.error(err);
        consola.info("[DATABASE] connected!");
    }
);

requireDir({ dir: "schemas/" }, (err, [file, path]) => {
    if (err) console.log(err);
    const bracks = path.includes("/") ? "/" : "\\";
    module.exports[
        path
            .split(bracks)
            .slice(-1)
            .pop()
            .substr(0, path.split(bracks).slice(-1).pop().length - 3)
    ] = file;
});
