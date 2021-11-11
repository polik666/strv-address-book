class Contact {
    lastName
    firstName
    phone
    address
    owner

    constructor(lastName, firstName, phone, address, owner) {
        this.lastName = lastName || null
        this.firstName = firstName || null
        this.phone = phone || null
        this.address = address || null
        this.owner = owner || null
    }
}

module.exports = Contact