class UserController{

    async getUserById(req, res) {
        try {
            return res.status(200).json()
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
}

module.exports = new UserController
