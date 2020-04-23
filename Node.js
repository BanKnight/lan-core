module.exports = class Node
{
    constructor(lan, meta)
    {
        this.lan = lan
        this.meta = meta

        this.msgs = []
        this.waitings = []

        this.want_dead = false
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

    async recv()
    {
        return new Promise((resolve, reject) =>
        {
            this.waitings.push(resolve)
        })
    }

    async send(packet)
    {
        packet.from = packet.from || this.id

        this.lan.send(packet)
    }

    push(msg)
    {
        this.msgs.push(msg)

        const loop = Math.min(this.msgs.length, this.waitings.length)

        for (let i = 0; i < loop; ++i)
        {
            let first = this.msgs.shift()
            let wake = this.waitings.shift()

            wake(first)
        }
    }

    get alive()
    {
        return this.dead != true || (this.want_dead && this.msgs.length == 0)
    }

    /**
     * 软关闭：消息处理完就退出
     * 
     */
    soft_off()
    {
        this.want_dead = true

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