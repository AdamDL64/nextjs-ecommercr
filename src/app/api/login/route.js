import connectToDB from "@/database";
import User from "@/models/user";
import { compare } from "bcryptjs";
import Joi from "joi";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

// validate type step1
const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const dynamic = "force-dynamic";

export async function POST(req) {

    await connectToDB()
    //ค่าจากผู้ใช้ส่งมาจากfronent
    const { email, password } = await req.json()

    //validate type step2 
    const { error } = schema.validate({ email, password })
    if (error) {
        return NextResponse.json({
            success: false,
            message: error.details[0].message
        })
    }

    try {
        //validate login  step1 check email user ว่ามีใหม่
        const checkUser = await User.findOne({ email })

        if (!checkUser) {
            return NextResponse.json({
                success: false,
                message: "Account not found with this email"
            })
        }
        //step2 ตรวจสอบรหัส password ตัวแรก passwordทีรับจากผู้ใช้ ตัวหลังที่ค้นหาในmogo
        const checkPassword = await compare(password, checkUser.password)
        if (!checkPassword) {
            return NextResponse.json({
                success: false,
                message: "Incoorect password. Please try again !"
            })
        }

        //step 3 เข้ารหัส token เข้าสู้ระบบ
        const token = jwt.sign({
            id: checkUser?._id, email: checkUser?.email, role: checkUser?.role
        }, 'default_secret_key', { expiresIn: '1d' })

        const finalData = {
            token,

            user: {
                email: checkUser.email,
                name: checkUser.name,
                _id: checkUser._id,
                role: checkUser.role
            }

        }
        return NextResponse.json({
            success: true,
            message: 'Login successfully !',
            finalData
        })

    } catch (error) {
        console.log(error, 'Error while logging In. please try again path error app/api/login')
        return NextResponse.json({
            success: false,
            message: 'Somthing went wrong ! please try again later'
        })
    }

}