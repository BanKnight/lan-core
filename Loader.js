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
        const whole = path.resolve(this.options.search, template)

        return require(whole)
    }
}