import connectToDB from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Cart from "@/models/cart";
import { NextResponse } from "next/server";




export const dynamic = "force-dynamic";

export  async function DELETE(req){

    try {

        await connectToDB()
        const isAuthUser = await AuthUser(req)

        const {searchParams} = new URL(req.url)
        const id = searchParams.get('id')

        if(!id) return NextResponse.json({success : false, message:"Cart items ID required"})

        const deleteCartItem = await Cart.findByIdAndDelete(id)
        if(deleteCartItem){
            return NextResponse.json({
                success:true,
                message:"Delete Cart Items successfully"
            })
        }else{
            return NextResponse.json({
                success:false,
                message:"Failed to delete Cart item! Please try agin later"
            })
        }

        


        
    } catch (error) {
        console.log(error ,'error delete-from-cart')
        return NextResponse.json({
            success:false,
            message:"Somthing went worng ! please try gain later"
        })
    }
}