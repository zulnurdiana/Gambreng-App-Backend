import { signIn, signUp, verifyAccount, sendChangePasswordEmail, verifyNewPassword, signOut } from "@/controllers/auth.controller";
import { Router } from "express";

const router = Router();

router.post("/signup", signUp);
router.post("/signout", signOut);
router.post('/account/verify', verifyAccount)
router.post('/signin', signIn);
router.post('/password/send', sendChangePasswordEmail);
router.post('/password/verify', verifyNewPassword)

export default router;
