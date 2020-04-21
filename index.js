const path = require("path")
const Dhcp = require("./Dhcp")
const Dns = require("./Dns")

module.exports = class Lan
{
    constructor(config)
    {
        this.config = config

        this.Dhcp = Dhcp
        this.Dns = Dns

        this.dhcp = null
        this.dns = null

        this.search = null
        this.nodes = {}
    }

    define_dhcp(dhcp)
    {
        this.Dhcp = dhcp
    }

    define_dns(dns)
    {
        this.Dns = dns
    }

    set_search(path)
    {
        this.search = path.resolve(path)
    }

    async new_node(info)
    {
        const node = { ...info }

        if (info.id == null)
        {
            await this.dhcp.regist(node)
        }

        this.nodes[node.id] = node

        return node.id
    }

    start()
    {
        this.dhcp = new this.Dhcp(this, this.config.dhcp)
        this.dns = new this.Dns(this, this.config.dns)

        
    }

    stop()
    {

    }
}
























