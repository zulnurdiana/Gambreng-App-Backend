import server from '@/server'

const port = process.env.PORT

server.listen(port, () => {
    console.log(`[Server] Listening on: http://localhost:${port}`)
})