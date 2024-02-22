const JWT = require('jsonwebtoken')
const lodash = require('lodash')

const createTokens = ({publicKey, privateKey, payload}) => {
    const access_token = JWT.sign(payload, privateKey, {
        algorithm:'RS256',
        expiresIn:'2h'
    })

    const refresh_token = JWT.sign(payload, privateKey, {
        algorithm:'RS256',
        expiresIn:'30 days'
    })

    JWT.verify(access_token, publicKey, (err, payload) => {
        if(err){
            console.log('Lỗi verify token');
            return 
        }
        console.log(payload);
    })

    return {access_token, refresh_token}
}

const getInfoData = ({feilds = [], object = {}}) => {
    return lodash.pick(object, feilds)
}



module.exports = { createTokens, getInfoData }