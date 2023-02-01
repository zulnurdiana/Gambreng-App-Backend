import server from '@/server'

const port = 5000

server.listen(port, () => {
    console.log(`[Server] Listening on: http://localhost:${port}`)
})