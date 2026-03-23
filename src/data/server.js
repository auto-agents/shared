export default class Server {

    constructor(id, baseUrl, port, share = 1) {
        this.id = id
        this.baseUrl = baseUrl
        this.port = port
        this.share = share
    }

    equalsTo(server) {
        return this.id == server.id
            && this.baseUrl == server.baseUrl
            && this.port == server.port
    }
}
