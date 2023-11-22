
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

const AuthUser = async (req) => {
    const token = req.headers.get("Authorization")?.split(" ")[1];
console.log(token,'middleware token')
    if (!token) return false;

    try {
        //ใช้ jwt ตรวจสอบ token โดยใช้ verify ค่าเริ่มต้น
        const extractAuthUserInfo = jwt.verify(token, "default_secret_key");
        console.log(extractAuthUserInfo,'middleware tokenUser')
        if (extractAuthUserInfo) return extractAuthUserInfo;
    } catch (e) {
        console.log(e);
        return false;
    }
};

export default AuthUser;