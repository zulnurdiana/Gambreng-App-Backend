import { store, getAll } from "@/controllers/globalMessage.controller";
import { Router } from "express";
import { requireUser } from "@/middleware/requireUser";

const router = Router();

router.post("/", requireUser, store);
router.get("/", requireUser, getAll)
// router.put("/:id", requireAdmin, update)
// router.delete("/:id", requireAdmin, destroy)

export default router;
