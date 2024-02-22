const UserModel = require('../user.model')

const findUserByEmail = async(email) => {
    return await UserModel.findOne({email}).lean()
}

const findUserByPhone = async(phone) => {
    return await UserModel.findOne({phone}).lean()
}

const findUserById = async(id) => {
    return await UserModel.findById(id).lean()
}

module.exports = {
    findUserByEmail,
    findUserByPhone,
    findUserById
}