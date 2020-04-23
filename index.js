const path = require("path")
const extend = require("extend2")

const default_config = require("./default_config")

module.exports = class Lan
{
    constructor(config)
    {
        this.config = extend(true, {}, default_config, config);

        this.dhcp = null
        this.dns = null

        this.nodes = {}
    }

    async start()
    {
        await this._try_load_dhcp()
        await this._try_load_dns()

    }

    async new_node(info,...args)
    {
        const node = { ...info,lan:this,args:args }

        if (info.id == null)
        {
            await this.dhcp.regist(node)
        }

        this.nodes[node.id] = node

        const whole_path = path.resolve(this.config.search,info.template)

        const func = require(whole_path)

        await func(node,...args)

        return node.id
    }

    stop()
    {

    }

    _try_load_dhcp()
    {
        const whole_path = path.resolve(this.config.search,"dhcp")

        try
        {
            const third = require(whole_path)

            this.dhcp = new third(this,this.config.dhcp)
        }
        catch(e)
        {
            console.log("dhcp is not exists,use default dhcp")
        }
    }

    _try_load_dns()
    {
        const whole_path = path.resolve(this.config.search,"dns")

        try
        {
            const third = require(whole_path)

            this.dns = new third(this,this.config.dns)
        }
        catch(e)
        {
            console.log("dns is not exists,use default dns")
        }
    }

  
}
























