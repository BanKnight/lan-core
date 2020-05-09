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
    constructor()
    {
        this.dhcp = null
        this.dns = null
        this.loader = null

        this.nodes = {}                             //[node.id] = node
        this.addresses = {}                         //[node.address] = node
    }

    async init(options)
    {
        this.config = extend(true, {}, config, options);

        await this._init_dhcp()
        await this._init_dns()
        await this._init_loader()
    }

    async start()
    {
        await this.dhcp.start()
        await this.dns.start()
    }

    async new_node(info)
    {
        const meta = JSON.parse(JSON.stringify(info))

        meta.address = meta.address || shortid()
        meta.args = meta.args || []

        const NodeClass = this.config.Node || Node
        const node = new NodeClass(this, meta)

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
            const node = this.nodes[msg.to]
            if (node == null)
            {
                return false
            }

            node.push(msg)

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

    uninit()
    {

    }

    _init_dhcp()
    {
        let Class = this.config.Dhcp || Dhcp

        this.dhcp = new Class(this, this.config.dhcp)
    }

    _init_dns()
    {
        let Class = this.config.Dns || Dns

        this.dns = new Class(this, this.config.dns)
    }

    _init_loader()
    {
        let Class = this.config.Loader || Loader

        this.loader = new Class(this, this.config.loader)
    }
}









