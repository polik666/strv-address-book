class Contact {
    lastName
    firstName
    phone
    address
    owner

    constructor(lastName, firstName, phone, address, owner) {
        this.lastName = lastName
        this.firstName = firstName
        this.phone = phone
        this.address = address
        this.owner = owner
    }
}

module.exports = Contact