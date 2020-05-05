const Queue = require("./Queue")

module.exports = class Node extends Queue
{
    constructor(lan, meta)
    {
        super()
        this.lan = lan
        this.meta = meta

        this.soft_dead = false
        this.hard_dead = false
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
        return this.hard_dead != true || (this.soft_dead && this.msgs.length == 0)
    }

    /**
     * 软关闭：消息处理完就退出
     * 需要调用方调用confirm_dead
     */
    soft_off()
    {
        this.soft_dead = true

        if (this.msgs.length > 0)
        {
            return
        }

        this.push(new Error("closed"))
    }

    /**
     * 硬关闭：忽略消息，立刻退出
     */
    hard_off()
    {
        this.hard_dead = true

        this.push(new Error("closed"))

        setImmediate(this.confirm_dead)
    }

    confirm_dead()
    {
        if (this.dead)
        {
            return
        }

        this.dead = true

        this.lan.remove_node(this.id)
    }

}