import { Request } from 'express'


interface RequestQuery {
  page: number
  limit: number
}

function getHandler(
  request: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  response: Response
) {
  const { query } = request;

  query.page; // number
  query.limit; // number
}

declare global {
  namespace Express {
    interface Request {
      user: any
    }
  }
}
