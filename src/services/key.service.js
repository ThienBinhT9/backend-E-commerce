const KeyModel = require('../models/key.model')

class KeyService{

    async createKeys({key_userId, publicKey, privateKey, refreshToken}){
        try {
            const query = {key_userId},
            upsert = {publicKey, privateKey, refreshToken},
            options = {upsert:true, new:true}

            const key = await KeyModel.findOneAndUpdate(query, upsert, options)
            return key ? key : null

        } catch (error) {
            return error.message
        }
    }

}

module.exports = new KeyService
