import { store, destroy, getAll, getById, update } from "@/controllers/game.controller";
import { Router } from "express";
import { requireAdmin } from "@/middleware/requireAdmin";
import { upload } from "@/utils";

const router = Router();

router.post("/", requireAdmin, upload.single('image'), store);
router.get("/", getAll)
router.get("/:id", getById)
router.put("/:id", requireAdmin, upload.single('image'), update)
router.delete("/:id", requireAdmin, destroy)

export default router;
