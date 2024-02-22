const KeyModel = require('../key.model')

const findKeyByUserId = async(key_userId) => {
    return await KeyModel.findOne({key_userId}).lean()
}

const deleteKeyById = async(key_id) => {
    await KeyModel.findByIdAndDelete(key_id).lean()
}

module.exports = {
    findKeyByUserId,
    deleteKeyById
}