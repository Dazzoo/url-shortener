import { createClient, RedisClientType } from 'redis'

const client: RedisClientType = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
})

client.on('error', (err: Error) => console.error('Redis Client Error:', err))
client.on('connect', () => console.log('Redis Client Connected'))

// Connect to Redis
client.connect().catch(console.error)

export default client 