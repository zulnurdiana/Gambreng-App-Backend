import { getAll, getById } from "@/controllers/gameForum.controller";
import { Router } from "express";
import { requireUser } from "@/middleware/requireUser";

const router = Router();

router.get("/", requireUser, getAll);
router.get("/:id", requireUser, getById);
// router.get("/", getAll)
// router.put("/:id", requireAdmin, update)
// router.delete("/:id", requireAdmin, destroy)

export default router;
