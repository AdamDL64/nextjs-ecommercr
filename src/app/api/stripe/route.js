
import AuthUser from "@/middleware/AuthUser";
import { NextResponse } from "next/server";


const stripe = require('stripe')('sk_test_51O32TCAMuQMIcPommvV4GP9LBGnUq82XK2s1Bx3vnTfHSjQG3IpiG5dWVlkbjkCOACC6gcnUvXSsol3xqSXWlNp400GO4RlKpx')

export const dynamic = "force-dynamic";

export async function POST(req) {


    try {

        const isAuthUser = await AuthUser(req);
        if (isAuthUser) {
            const res = await req.json();

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: res,
                mode: "payment",
                success_url: "http://localhost:3000/checkout" + "?status=success",
                cancel_url: "http://localhost:3000/checkout" + "?status=cancel",
            });

            return NextResponse.json({
                success: true,
                id: session.id,
            });
        } else {
            return NextResponse.json({
                success: true,
                message: "You are not authenticated",
            });
        }
    } catch (error) {
        console.log(error, 'error stripe')
        return NextResponse.json({
            status: 500,
            success: false,
            message: "Something went worng ! please try again later"
        })
    }
}