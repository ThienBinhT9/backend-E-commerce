const dotenv = require('dotenv')
const JWT =  require('jsonwebtoken')

const {findKeyByUserId} = require('../models/repo/key.repo')

dotenv.config()

const authorized = async(req, res, next) => {

    const access_token = req.headers[process.env.ACCESS_TOKEN]?.toString()
    if(!access_token) return res.status(404).json('NotFound access_token')

    const client_id = req.headers[process.env['X-CLIENT-ID']]?.toString()
    if(!client_id) return res.status(404).json('NotFound x-client-id')

    const key = await findKeyByUserId(client_id)
    if(!key) return res.status(404).json('NotFound key')

    JWT.verify(access_token, key.publicKey, (err, payload) => {
        if(err) return res.status(401).json('Token không hợp lệ!')
        if(payload.userId !== client_id) return res.status(401).json('Bạn không có quyền!')

        req.key = key
        req.user_id = payload.userId
        req.access_token = access_token
        return next()
    })
    
}

const authorizedV2 = async(req, res, next) => {

    const refresh_token = req.headers[process.env.REFRESH_TOKEN]?.toString()
    if(!refresh_token) return res.status(404).json('NotFound refresh_token')

    const client_id = req.headers[process.env['X-CLIENT-ID']]?.toString()
    if(!client_id) return res.status(404).json('NotFound x-client-id')

    const key = await findKeyByUserId(client_id)
    if(!key) return res.status(404).json('NotFound key')

    JWT.verify(refresh_token, key.publicKey, (err, payload) => {
        if(err) return res.status(401).json('Token không hợp lệ!')
        if(payload.userId !== client_id) return res.status(401).json('Bạn không có quyền!')
        req.key = key
        req.refresh_token = refresh_token
        return next()
    })
}

module.exports = {authorized, authorizedV2}