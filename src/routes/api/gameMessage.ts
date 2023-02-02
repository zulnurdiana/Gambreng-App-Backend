import { store } from "@/controllers/gameMessage.controller";
import { Router } from "express";
import { requireUser } from "@/middleware/requireUser";

const router = Router();

router.post("/", requireUser, store);
// router.get("/", getAll)
// router.put("/:id", requireAdmin, update)
// router.delete("/:id", requireAdmin, destroy)

export default router;
