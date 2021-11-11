const SchemaUser = require('./mongo-schemas/mongo-user')
const SchemaRefreshToken = require('./mongo-schemas/mongo-refresh-token')
const { getDatabase } = require('firebase-admin/database')

async function getUserByEmail(email) {
    return await SchemaUser.findOne({email: email}).clone()
}

async function userExists(m) {
    return await SchemaUser.exists({email: m})
}

async function createUser(user) {
    const u = new SchemaUser(user)
    await u.save();
    user.id = u._id;
    return user;
}

async function refreshTokenExists(token) {
    return await SchemaRefreshToken.exists({token: token})
}

async function createRefreshToken(refreshToken) {
    const rt = new SchemaRefreshToken(refreshToken)
    await rt.save()
}

async function createContact(contact) {
    const db = getDatabase();
    const ref = db.ref('contacts/' + contact.owner);
    await ref.push(contact)
}

module.exports = {
    getUserByEmail,
    userExists,
    createUser,
    refreshTokenExists,
    createRefreshToken,
    createContact
}