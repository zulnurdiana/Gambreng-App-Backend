import { getResponse } from "@/utils";
import { NextFunction, Request, Response } from "express";

export function requireUser(req: Request, res: Response, next: NextFunction) {
  // @ts-ignore
  if (!req.user) {
    return getResponse(res, 401, 'Unauthorized', {});
  }

  return next()
}
