import { Router } from 'express'
const router = Router()

import auth from "./api/auth";
import event from "./api/event";
import game from "./api/game";


router.use("/auth", auth);
router.use("/event", event);
router.use("/game", game);

export default router