const Lan = require("./Lan")
const Dhcp = require("./Dhcp")
const Dns = require("./Dns")
const GateWay = require("./GateWay")

const lan = new Lan()

//dhcp + dns 确定的类
//gateway 用 node实现

lan.set_dhcp(new Dhcp())               //设置dhcp
lan.set_dns(new Dns())

lan.set_search()                      //设定搜索路径,";"隔开

const id = await lan.new_node({         //通过dhcp决定它的id，也可以自行定义
    template: xxx,
    // id: xxx,             //静态id
    // address: xxx,        //address：可选，用于dhcp，分配静态id
})

lan.setup()

lan.send({
    from: 0,
    to: id,
    path: xxx,
    head: {},
    body: {},
})




