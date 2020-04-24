module.exports = class Queue
{
    constructor()
    {
        this.msgs = []
        this.waitings = []
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

    pop()
    {
        if (this.msgs.length > 0)
        {
            return this.msgs.shift()
        }

        return new Promise((resolve) =>
        {
            this.waitings.push(resolve)
        })
    }

    close()
    {
        for (let i = 0, loop = this.waitings.length; i < loop; ++i)
        {
            let wake = this.waitings.shift()

            wake()
        }
    }
}