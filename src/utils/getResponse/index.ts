import { Response } from 'express'

const getResponse = (
    res: Response,
    statusCode: number,
    message: string,
    data: any
): Response => {
    return res
        .status(statusCode)
        .json({
            code: statusCode,
            status: statusCode < 400 ? 'success' : 'failed',
            message,
            data,
        })
        .end()
}

export default getResponse
