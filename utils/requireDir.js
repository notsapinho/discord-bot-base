const { readdir, statSync } = require("fs");
const { resolve } = require("path");

module.exports = function requireDir({ dir, filesOnly = ["js", "json"], recursive = true }, callback) {
    readdir(dir, (err, files) => {
        if (err) throw new Error(err);

        for (const file of files) {
            const fullPath = resolve(dir, file);

            if (statSync(dir + "/" + file).isDirectory() && recursive) requireDir({ dir: dir + "/" + file, filesOnly }, callback);

            if (!filesOnly.some((ext) => new RegExp(`.${ext}$`).test(file))) continue;

            try {
                const required = require(fullPath);
                callback(null, [required, fullPath]);
            } catch (err) {
                callback(err, file);
            }
        }
    });
};
