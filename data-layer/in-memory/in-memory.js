const User = require('../../models/user')
const RefreshToken = require('../../models/refresh-token')

const users = []
const refreshTokens = []
const contacts = []

async function getUserByEmail(email) {
    return users.find(x => x.email === email);
}

async function userExists(email) {
    return users.filter(x => x.email === email).length != 0;
}

async function createUser(user) {
    users.push(user);
}

async function refreshTokenExists(token) {
    return refreshTokens.filter(x => x.token === token).length != 0;
}

async function createRefreshToken(refreshToken) {
    refreshTokens.push(refreshToken)
}

async function createContact(contact) {
    contacts.push(contact);
}

module.exports = {
    getUserByEmail,
    userExists,
    createUser,
    refreshTokenExists,
    createRefreshToken,
    createContact
}