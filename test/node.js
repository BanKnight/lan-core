module.exports = async function (...args)
{
    console.log(this.id, "start ", ...args)

    while (this.alive)
    {
        const msg = await this.pop()

        if (msg instanceof Error)
        {
            continue
        }

        console.log(this.id, "recv msg from", msg.from, msg.method, msg.body)

        if (msg.method == "add")
        {
            this.send({
                to: msg.body,
                method: "ping",
                body: `hello from ${this.id}`
            })
        }
    }

    this.confirm_dead()
}


