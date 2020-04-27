const path = require("path")
const shortid = require("shortid").generate
const extend = require("extend2")

const config = require("./config")

const Dhcp = require("./Dhcp")
const Dns = require("./Dns")
const Loader = require("./Loader")

const Node = require("./Node")

module.exports = class Lan
{
    constructor(options)
    {
        this.config = extend(true, {}, config, options);

        this.dhcp = null
        this.dns = null
        this.loader = null

        this.nodes = {}                             //[node.id] = node
        this.addresses = {}                         //[node.address] = node
    }

    async start()
    {
        await this._init_dhcp()
        await this._init_dns()
        await this._init_loader()

        await this.dhcp.start()
        await this.dns.start()
    }

    async new_node(info)
    {
        const meta = JSON.parse(JSON.stringify(info))

        meta.address = meta.address || shortid()
        meta.args = meta.args || []

        const node = new Node(this, meta)

        if (node.id == null)
        {
            node.id = await this.dhcp.regist(meta.address)
        }

        this.nodes[node.id] = node
        this.nodes[node.address] = node

        const func = this.loader.load(meta.template)

        setImmediate(() =>
        {
            func.call(node, ...meta.args)
        })

        return node.id
    }

    /**
     * 软关闭：所有消息处理完后，node.alive 为false
     * 调用方需要调用confirm_dead
     * @param {要关闭的节点} id 
     */
    soft_off(id)
    {
        const node = this.nodes[id]

        if (node == null)
        {
            return false
        }

        node.soft_off()
    }

    hard_off(id)
    {
        const node = this.nodes[id]

        if (node == null)
        {
            return false
        }

        node.hard_off()
    }

    remove_node(id)
    {
        const node = this.nodes[id]
        if (node == null)
        {
            return
        }

        delete this.nodes[id]
        delete this.addresses[node.address]
    }

    send(msg)
    {
        const is_same_network = this.dhcp.is_same(msg.to)
        if (is_same_network == true)
        {
            const gateway = this.nodes[msg.to]
            if (gateway == null)
            {
                return false
            }

            gateway.push(msg)

            return
        }

        const gateway_id = this.dhcp.id

        const gateway = this.nodes[gateway_id]

        if (gateway == null)
        {
            return false
        }

        gateway.push({
            method: "t",         //t as transform
            body: msg
        })
    }

    stop()
    {

    }

    _init_dhcp()
    {
        const whole_path = path.resolve(this.config.search, "Dhcp")

        try
        {
            const third = require(whole_path)

            this.dhcp = new third(this, this.config.dhcp)
        }
        catch (e)
        {
            console.log("dhcp is not exists,use default dhcp")

            this.dhcp = new Dhcp(this, this.config.dhcp)
        }
    }

    _init_dns()
    {
        const whole_path = path.resolve(this.config.search, "Dns")

        try
        {
            const third = require(whole_path)

            this.dns = new third(this, this.config.dns)
        }
        catch (e)
        {
            this.dns = new Dns(this, this.config.dns)

            console.log("dns is not exists,use default dns")
        }
    }

    _init_loader()
    {
        const whole_path = path.resolve(this.config.search, "Loader")

        try
        {
            const third = require(whole_path)

            this.loader = new third(this, this.config.loader)
        }
        catch (e)
        {
            this.loader = new Loader(this, this.config.loader)

            console.log("loader is not exists,use default loader")
        }
    }
}
























