const brcypt = require('bcrypt')
const crypto = require('crypto') 

const UserModel = require('../models/user.model')
const KeyModel = require('../models/key.model')
const KeyService = require('../services/key.service')
const { deleteKeyById } = require('../models/repo/key.repo')
const { findUserByEmail, findUserByPhone, findUserById } = require('../models/repo/user.repo')
const { createTokens, getInfoData } = require('../utils')

class AuthService{

    async register({username, password, email, phone}){
        try {
            const foundUserByEmail = await findUserByEmail(email)
            if(foundUserByEmail) return {
                code:401,
                message:'Email đã được đã được sử dụng!'
            }

            const foundUserByPhone = await findUserByPhone(phone)
            if(foundUserByPhone) return {
                code:401,
                message:'Số điện thoại đã được sử dụng!'
            }

            const hashed_password = await brcypt.hash(password, 10)

            const newUser = await UserModel.create({username, email, phone, roles:['USER'], password:hashed_password})
            if(!newUser) return {
                code:401,
                message:'Tạo tài khoản không thành công'
            }

            const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem',
                },
                privateKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem',
                },
            })

            const tokens = createTokens({publicKey, privateKey, payload:{userId:newUser._id}})

            const key = await KeyService.createKeys({
                key_userId:newUser._id,
                publicKey, 
                privateKey,
                refreshToken:tokens.refresh_token
            })
            if(!key) return {
                code:401,
                message:'Tạo key không thành công'
            }

            return {
                code:201,
                metadata:{
                    ...getInfoData({feilds:['_id', 'username', 'email', 'avatar', 'phone', 'address', 'roles'], object:newUser}),
                    ...tokens
                }
            }
            
        } catch (error) {
            return error.message
        }
    }

    async login({email, password}) {
        try {
            const foundUser = await findUserByEmail(email)
            if(!foundUser) return {
                code:404,
                message:'Email chưa được sử dụng'
            }

            const validPassword = await brcypt.compare(password, foundUser.password)
            if(!validPassword) return {
                code:401,
                message:'Mật khẩu không đúng'
            }

            const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem',
                },
                privateKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem',
                },
            })

            const tokens = createTokens({publicKey, privateKey, payload:{userId:foundUser._id}})

            const key = await KeyService.createKeys({
                key_userId:foundUser._id,
                privateKey,
                publicKey,
                refreshToken:tokens.refresh_token
            })
            if(!key) return {
                code:401,
                message:'Tạo key không thành công'
            }

            return {
                code:201,
                metadata:{
                    ...getInfoData({feilds:['_id', 'username', 'email', 'avatar', 'phone', 'address', 'roles'], object:foundUser}),
                    ...tokens
                }
            }


        } catch (error) {
            return error.message
        }
    }

    async logout({key, user_id}) {
        try {
            const foundUser = await findUserById(user_id)
            if(!foundUser) return {
                code:404,
                message:'Người dùng không tồn tại'
            }

            await deleteKeyById(key._id)

            return {
                code:201,
                message:'Đăng xuất thành công!'
            }
        } catch (error) {
            return error.message
        }
    }

    async handleRefreshTokens({key, refreshToken}){
        try {
            const {_id, key_userId, publicKey, privateKey} = key
            
            if(key.refreshTokenUsed.includes(refreshToken)){
                await deleteKeyById(_id)
                return {
                    code:401,
                    message:'Vui lòng đăng nhập lại'
                }
            }

            if(refreshToken !== key.refreshToken) return {
                code:401,
                message:'Bạn không có quyền'
            }

            const foundUser = await findUserById(key_userId)
            if(!foundUser) return {
                code:401,
                message:'Bạn không có quyền'
            }

            const tokens = createTokens({publicKey, privateKey, payload:{userId:key_userId}})
            await KeyModel.updateOne({key_userId}, {
                $addToSet:{
                    refreshTokenUsed:refreshToken
                },
                $set:{
                    refreshToken:tokens.refresh_token
                }
            })

            return {
                code:201,
                metadata:{...tokens}
            }

        } catch (error) {
            return error.message
        }
    }

}

module.exports = new AuthService
