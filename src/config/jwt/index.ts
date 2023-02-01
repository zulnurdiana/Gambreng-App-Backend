import jwt from 'jsonwebtoken'

const publicKey = process.env.PUBLIC_KEY as string
const privateKey = process.env.PRIVATE_KEY as string

// Sign JWT
export function signJWT(payload: object, expiresIn: string | number) {
    return jwt.sign(payload, privateKey, {
        algorithm: "RS256",
        expiresIn
    })
}

// verify JWT
export function verifyJWT(token: string) {
    try {
        const decoded = jwt.verify(token, publicKey)
        return {
            payload: decoded,
            expired: false
        }
    } catch (error) {
        return {
            payload: null,
            expired: error
        }
    }
}