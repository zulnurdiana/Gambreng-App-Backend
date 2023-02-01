import { createEvent, destroy, getAllEvent, getById, update } from "@/controllers/event.controller";
import { Router } from "express";
import { requireAdmin } from "@/middleware/requireAdmin";
import { upload } from "@/utils";

const router = Router();

router.post("/", requireAdmin, upload.single('image'), createEvent);
router.get("/", getAllEvent)
router.get("/:id", getById)
router.put("/:id", requireAdmin, upload.single('image'), update)
router.delete("/:id", requireAdmin, destroy)

export default router;
