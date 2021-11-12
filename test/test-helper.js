function containsValidationError(res, field, message) {
    return res.body.filter((e) => e.field === field && e.message === message).length > 0
}

module.exports = {
    containsValidationError,
}
