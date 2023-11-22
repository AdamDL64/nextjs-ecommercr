import connectToDB from "../../../database/index";
import User from "@/models/user";
import { hash } from "bcryptjs";
import Joi from "joi";
import { NextResponse } from "next/server";

//validate the schema 1
const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().required(),
});
export const dynamic = "force-dynamic";


export async function POST(req) {
    await connectToDB()
    const { name, email, password, role } = await req.json();

    //validate the schema 2
    const { error } = schema.validate({ name, email, password, role });

    if (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: error.details[0].message,
        });
    }
    try {
        //1 ตรวจสอบว่ามี user นี้หรือยัง ค้นหาว่ามี email นี้ไหม
        const isUserAlreadyExists = await User.findOne({ email });

        if (isUserAlreadyExists) {
            return NextResponse.json({
                success: false,
                message: "User is already exists. Please try with different email.",
                
            });
        } else {
            //2case ที่ ยังไมมี ใช้ bcryptjs เข้า รหัส และcreate email ใน User in mogonse db
            const hashPassword = await hash(password, 12);

            const newlyCreatedUser = await User.create({
                name,
                email,
                password: hashPassword,
                role,
            });
            if (newlyCreatedUser) {

                return Response.json({
                    success: true,
                    message: 'Account create successfully '
                })
            }
        }

    } catch (error) {
        console.log('Error is new User Registration')

        return NextResponse.json({
            success: false,
            message: 'Something went wrong ! please try again later at api/register'
        })
    }

}