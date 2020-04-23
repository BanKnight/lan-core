module.exports = (node, ...args) =>
{
    while (node.alive)
    {
        const packet = await node.recv()

        if (packet == null)
        {
            continue
        }

        switch (packet.proto)
        {
            case "sys":
                handle_sys(node, packet)
                break
        }
    }
}


