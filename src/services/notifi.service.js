const notifiModel = require('../models/notifi.model')

class NotifiService{

    async createNotification({noti_type = 'SHOP-001', noti_senderId, noti_receivedId, noti_option}){
        try {
            let noti_content
            if(noti_type === 'SHOP-001'){
                content = '@@@ đã thêm một sản phẩm mới: @@@@'
            }else if(noti_type === 'PROMOTION-001'){
                content = '@@@ đã thêm một voucher mới: @@@@'
            }

            const notification = await notifiModel.create({
                noti_type,
                noti_senderId,
                noti_receivedId,
                noti_content,
                noti_option
            })

            return {
                code:201,
                metadata:notification
            }
        } catch (error) {
            return {
                code:500,
                message:error.message
            }
        }
    }

    async getListNotifi(){
        try {
            
        } catch (error) {
            return {
                code:500,
                message:error.message
            }
        }
    }
}

module.exports = new NotifiService
