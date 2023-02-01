import { Router } from 'express'
const router = Router()
import auth from "./api/auth";
import event from "./api/event";

router.use("/auth", auth);
router.use("/event", event);
export default router