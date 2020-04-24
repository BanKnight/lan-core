const extend = require("extend2")

const default_options = {
    statics: {},                                    //静态主机,[address] = ip
}

module.exports = class Dhcp
{
    constructor(lan, options = {})
    {
        this.lan = lan
        this.options = extend(true, {}, default_options, options);

        this.id = this.options.id || "lan"                          //本方地址
        this.statics = this.options.statics                         //静态主机：[address] = ip

        this.helper = 0
        this.nodes = {}                                             //当前分配：[id] = address
    }

    start()
    {

    }

    /**
     * 判断是否相同网络
     */
    is_same(id)
    {
        return id.indexOf(this.id) == 0
    }

    async regist(node)
    {
        if (node.id)
        {
            this.nodes[node.id] = node.address
            return
        }

        if (node.address)              //看看是否有静态地址
        {
            node.id = this.statics[node.address]
        }

        while (node.id == null)
        {
            this.helper++

            const id = `${this.id}.${this.helper}`

            if (this.nodes[id])
            {
                continue
            }

            node.id = id
        }

        this.nodes[node.id] = node.address
    }

    async unregist(id)
    {
        delete this.nodes[id]
    }
}