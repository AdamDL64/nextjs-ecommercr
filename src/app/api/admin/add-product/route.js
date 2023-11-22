import connectToDB from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Product from "@/models/product";
import Joi from "joi";
import { NextResponse } from "next/server";


const AddNewProductSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    sizes: Joi.array().required(),
    deliveryInfo: Joi.string().required(),
    onSale: Joi.string().required(),
    priceDrop: Joi.number().required(),
    imageUrl: Joi.string().required(),
})

export const dynamic = "force-dynamic";

export async function POST(req) {

    try {
        await connectToDB()

        // const user = 'admin'

        const isAuthUser = await AuthUser(req)
           //checkบัญชีว่า เป็น admin ไหม
// console.log(isAuthUser, 'check isAuthUser')
        if (isAuthUser.role === 'admin') {
            //ค่าที่ ส่งมาจากหน้าบ้าน
            const extractData = await req.json()
            const {
                name,
                description,
                price,
                imageUrl,
                category,
                sizes,
                deliveryInfo,
                onSale,
                priceDrop } = extractData
                

            //validate data info from fronent
            const { error } = AddNewProductSchema.validate({
                name,
                description,
                price,
                imageUrl,
                category,
                sizes,
                deliveryInfo,
                onSale,
                priceDrop
            })
            if (error) {
                return NextResponse.json({
                    success: false,
                    message: error.details[0].message
                })
            }

            //บันทึกข้อมูล
            const newlyCreatedProduct = await Product.create(extractData)

            if(newlyCreatedProduct){

                return NextResponse.json({
                    success:true,
                    message:'Product addded successfully'
                })
            }else{
                return NextResponse.json({
                    success:false,
                    message:'failed to add the Product ! try again'
                })
            }

        } else {
            return NextResponse.json({
                success: false,
                message: "You are not Autorized ! path admin add-product"
            })
        }

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Somthing went wrong ! please try again later Add-product"
        })
    }
}