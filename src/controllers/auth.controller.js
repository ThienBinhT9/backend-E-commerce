const AuthService = require('../services/auth.service')

class AuthController{

    async register(req, res){
        try {
            return res.status(200).json(await AuthService.register(req.body))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    async login(req, res) {
        try {
            return res.status(200).json(await AuthService.login(req.body))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    async logout(req, res) {
        try {
            return res.status(200).json(await AuthService.logout({key:req.key, user_id:req.user_id}))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    async handleRefreshTokens(req, res) {
        try {
            return res.status(200).json(await AuthService.handleRefreshTokens({key:req.key, refreshToken:req.refresh_token}))
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
}

module.exports = new AuthController