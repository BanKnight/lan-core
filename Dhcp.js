const default_options = {
    statics: {},                                    //静态主机,[address] = ip
}

module.exports = class Dhcp
{
    constructor(lan, options = default_options)
    {
        this.lan = lan
        this.helper = 0

        this.id = options.id || "lan"                               //本方地址
        this.nodes = {}                                             //当前分配：[id] = address/true
        this.statics = Object.assign({}, options.statics || {})     //静态主机：[address] = ip
    }

    async regist(node)
    {
        if (node.id)
        {
            this.nodes[node.id] = true
            return
        }
        else if (node.address)              //看看是否有静态地址
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
            break
        }

        this.nodes[node.id] = true
    }

    async unregist(id)
    {
        let address_or_true = this.nodes[id]

        if (address_or_true === true)
        {
            delete this.nodes[id]
        }
    }
}