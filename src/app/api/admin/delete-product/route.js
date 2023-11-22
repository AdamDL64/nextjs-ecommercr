import connectToDB from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Product from "@/models/product";

import { NextResponse } from "next/server";



export const dynamic = "force-dynamic";

export async function DELETE(req){
    try {
        await connectToDB()
        //middleware
        const isAuthUser = await AuthUser(req)
        if(isAuthUser?.role==='admin'){

        const {searchParams} = new URL(req.url);
        const id = searchParams.get('id')
        // console.log(searchParams)
        // console.log(id)
        if(!id){
            return NextResponse.json({
                success:false,
                message:'Product ID is requre'
            })
        }
        const deletedProduct = await Product.findByIdAndDelete(id)

        if(deletedProduct){
            return NextResponse.json({
                success:true,
                message:"Delele Product SuccessFully "
            })
        }else{
            return NextResponse.json({
                success:false,
                message:"Failed Delete Product ! Plese try again later"
            })
        }
        }else{
            return NextResponse.json({
                success:false,
                message:"You are not authenticated "
            })
        }

    
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success:false,
            message:"failed delete error api admin delete-product"
        })
    }
}