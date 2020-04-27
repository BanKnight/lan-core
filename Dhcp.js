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
                               
        this.nodes = {}                                             //当前分配：[id] = address
        this.addresses = {}                                         //静态主机：[address] = id
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

    async regist(address)
    {
        let id = this.options.statics[address]

        if(id == null)
        {
            id = this.addresses[address]          //相同地址，尽可能分配到同样的id
        }

        if(id == null)
        {
            id = `${this.id}.${address}`
        }

        this.nodes[id] = address
        this.addresses[address] = id

        return id
    }

    async unregist(id)
    {
        const address = this.nodes[id]

        if(address == null)
        {
            return
        }

        delete this.nodes[id]
        delete this.addresses[address]
    }

}