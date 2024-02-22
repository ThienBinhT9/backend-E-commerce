const redis = require('redis')
const redisClient = redis.createClient()
const { promisify } = require('util')
const { reservationInventory } = require('../models/repo/inventory.repo')

const pexpire = promisify(redisClient.pExpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)

const acquireLock = async ({product_id, quantity, cartId}) => {
    try {
        const key = `lock_v2023_${product_id}`
        const retryTimes = 10
        const expireTime = 3000

        for (let index = 0; index < retryTimes; index++) {
            
            //Tạo 1 key, ai giữ được key này thì mới thanh toán được
            const result = await setnxAsync(key, expireTime)
            console.log(`ressult: ${result}`);

            if(result === 1){
                //Thao tác với inventory
                const { modifiedCount } = await reservationInventory({productId, quantity, cartId})
                if(modifiedCount){
                    await pexpire(key, expireTime)
                    return key
                }
                return null
            }else{
                await new Promise((resolve) => setTimeout(resolve, 50))
            }
            
        }

    } catch (error) {
        return {
            code:500,
            message:error.message
        }
    }
}

const releaseLock = async(keyLock) => {
    try {
        const delAsyncLock = promisify(redisClient.del).bind(redisClient)
        return await delAsyncLock(keyLock)
    } catch (error) {
        return {
            code:500,
            message:error.message
        }
    }
}

module.exports = {
    acquireLock,
    releaseLock
}
