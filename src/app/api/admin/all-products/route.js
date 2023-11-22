import connectToDB from "@/database";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
    try {
        await connectToDB();

        const extractAllproducts = await Product.find({});

        if (extractAllproducts) {
            return NextResponse.json({
                success: true,
                data: extractAllproducts,
                message: "request product show all product success fully ",
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "No Product found",
                status: 204,
            });
        }
    } catch (error) {
        console.log(error, "error path api/admin all-product");
        return NextResponse.json({
            success: false,
            message: "Someting went wrong! please try again later",
        });
    }
}
