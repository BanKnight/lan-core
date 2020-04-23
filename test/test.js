const Lan = require("../index")

const lan = new Lan({
    search: "./test",
})

const id = await lan.new_node({         //通过dhcp决定它的id，也可以自行定义
    template: xxx,
    // id: xxx,             //静态id
    // address: xxx,        //address：可选，用于dhcp，分配静态id
    args: [],               //start args
})

lan.setup()

lan.send({
    from: 0,
    to: id,
    path: xxx,
    head: {},
    body: {},
})




