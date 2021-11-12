const validator = require("validator")

class User {
    id
    email
    password
    constructor(email, password) {
        this.email = email
        this.password = password
    }

    validate() {
        const errors = []
        if (!this.email) {
            errors.push({ field: "Email", message: "Email is required" })
        } else if (!validator.isEmail(this.email)) {
            errors.push({ field: "Email", message: "Email is not in correct format" })
        }

        if (!this.password) {
            errors.push({ field: "Password", message: "Password is required" })
        }
        return errors
    }
}

module.exports = User
