import { Router } from 'express'
const router = Router()

import auth from "./api/auth";
import event from "./api/event";
import game from "./api/game";
import gameForum from "./api/gameForum";
import gameMessage from "./api/gameMessage";

router.use("/auth", auth);
router.use("/event", event);
router.use("/game", game);
router.use("/game-forum", gameForum)
router.use("/game-message", gameMessage)
export default router