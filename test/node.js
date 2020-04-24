module.exports = async (node, ...args) =>
{
    console.log(node.id, "start ", ...args)

    while (node.alive)
    {
        const msg = await node.pop()

        if (msg == null)
        {
            continue
        }

        console.log(node.id, "recv msg from", msg.from, msg.method, body.toString())

        if (msg.method == "add")
        {
            node.send({
                to: msg.body,
                method: "ping",
                body: `hello from ${node.id}`
            })
        }
    }
}


