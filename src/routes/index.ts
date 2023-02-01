import { Router } from 'express'
const router = Router()
import auth from "./api/auth";


router.use("/auth", auth);

export default router