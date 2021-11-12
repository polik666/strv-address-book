const uuid = require("uuid")

function containsValidationError(res, field, message) {
    return res.body.filter((e) => e.field === field && e.message === message).length > 0
}

function generateMailAddress() {
    return `${uuid.v4()}@example.com`
}

module.exports = {
    containsValidationError,
    generateMailAddress,
}
