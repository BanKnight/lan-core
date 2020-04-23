module.exports = class Dns
{
    constructor(lan, options)
    {
        this.lan = lan
        this.options = options
        this.statics = {}
    }

    start()
    {

    }

    /**
     * 注册：A 记录，以后会需要增加其他记录，例如可以转发到另外一个dns服务器
     * @param {名称，支持通配符} name 
     * @param {地址} id 
     */
    async regist(name, id)
    {
        this.statics[name] = id
    }

    /**
     * 解析，返回id作为地址
     * @param {名称} name 
     */
    async resolve(name)
    {

    }
}