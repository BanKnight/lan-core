const Queue = require("./Queue")

module.exports = class Node extends Queue
{
    constructor(lan, meta)
    {
        super(lan, meta)
        this.lan = lan
        this.meta = meta

        this.soft_dead = false
        this.dead = false
    }

    get id()
    {
        return this.meta.id
    }

    set id(val)
    {
        this.meta.id = val
    }

    get address()
    {
        return this.meta.address
    }

    set address(val)
    {
        this.meta.address = val
    }

    async send(packet)
    {
        packet.from = packet.from || this.id

        this.lan.send(packet)
    }

    get alive()
    {
        return this.dead != true || (this.soft_dead && this.msgs.length == 0)
    }

    /**
     * 软关闭：消息处理完就退出
     * 
     */
    soft_off()
    {
        this.soft_dead = true

        //Todo tell lan to check if delete this node
    }

    /**
     * 硬关闭：忽略消息，立刻退出
     */
    hard_off()
    {
        this.dead = true

        let wake = this.waitings.shift()

        wake && wake()

        //Todo tell lan to delete this node
    }


}