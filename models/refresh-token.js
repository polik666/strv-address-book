class RefreshToken {
    token
    userId
    constructor(token, userId) {
        this.token = token
        this.userId = userId
    }
}

module.exports = RefreshToken
