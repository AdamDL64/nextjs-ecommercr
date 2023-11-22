import connectToDB from "@/database";
import Product from "@/models/product";
import { NextResponse } from "next/server";




export const dynamic = "force-dynamic";

export async function GET(req){

    try {
        await connectToDB()
        const {searchParams} = new URL(req.url)
        const id = searchParams.get('id')
        // console.log( searchParams,id,'getcatagory')
        const getData = await Product.find({category : id})
        if(getData){
            return NextResponse.json({
                success:true,
                data:getData
            })
        }else{
            return NextResponse.json({
                success:false,
                status:204,
                message:"No Product Found"
            })
        }
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success:false,
            message:'Somthing went wrong ! please try again later'
        })
    }
}