const path = require("path")

module.exports = class Loader
{
    constructor(lan, options)
    {
        this.lan = lan
        this.options = options
    }

    load(template)
    {
        return require(path.resolve(lan.config.search, template))
    }
}