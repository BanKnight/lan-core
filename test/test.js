const Lan = require("../index")

async function main()
{
    const lan = new Lan({
        loader: {
            search: __dirname,
        }
    })

    await lan.start()

    const id1 = await lan.new_node({         //通过dhcp决定它的id，也可以自行定义
        template: "node",
        // id: xxx,             //静态id
        address: "1",        //address：可选，用于dhcp，分配静态id
        args: [],               //start args
    })

    const id2 = await lan.new_node({         //通过dhcp决定它的id，也可以自行定义
        template: "node",
        // id: xxx,             //静态id
        args: [],               //start args
    })

    lan.send({
        from: 0,
        to: id1,
        proto: "test",
        method: "add",
        head: {},
        body: id2,
    })

    lan.send({
        from: 0,
        to: id2,
        proto: "test",
        method: "add",
        head: {},
        body: id1,
    })
}

main()





