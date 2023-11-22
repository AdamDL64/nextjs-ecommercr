import connectToDB from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Cart from "@/models/cart";
import { NextResponse } from "next/server";



export const dynamic = "force-dynamic";

export  async function GET(req){

    try {
        await connectToDB()

        const isAuthUser = await AuthUser(req)

        if(isAuthUser){

            const {searchParams} = new URL(req.url)
            const id = searchParams.get('id')
            console.log(id, 'all-cart-itens')

            if(!id){
                return NextResponse.json({
                    success:false,
                    message:"Please login in!"
                })
            }

            const extractAllCartItems = await Cart.find({userID:id})
            .populate('productID')

            if(extractAllCartItems){
                return NextResponse.json({
                    success:true,
                    data:extractAllCartItems,
                    message:'add to cart successfulyy'
                })
            }else{
                return NextResponse.json({
                    success:false,
                    message:"not Cart items found",
                    status:204
                })
            }


        }else{
            return NextResponse.json({
                success:false,
                message:"You are not Authenticated "
            })
        }

    } catch (error) {
        console.log(error,'error all-cart-items')
        return NextResponse.json({
            success:false,
            message:"Somthing went wrong! please try again later"
        })
    }
}

// import connectToDB from "@/database";
// import AuthUser from "@/middleware/AuthUser";
// import Cart from "@/models/cart";
// import { NextResponse } from "next/server";

// export const dynamic = "force-dynamic";

// export async function GET(req) {
//     try {
//         await connectToDB();

//         const isAuthUser = await AuthUser(req);

//         if (isAuthUser) {
//             const { searchParams } = new URL(req.url);
//             const id = searchParams.get("id");

//             if (!id)
//                 return NextResponse.json({
//                     success: false,
//                     message: "Please login in!",
//                 });
//             const extractAllCartItems = await Cart.find({ userID: id }).populate(
//                 "productID"
//             );

//             if (extractAllCartItems) {
//                 return NextResponse.json({ success: true, data: extractAllCartItems });
//             } else {
//                 return NextResponse.json({
//                     success: false,
//                     message: "No Cart items are found !",
//                     status: 204,
//                 });
//             }
//         } else {
//             return NextResponse.json({
//                 success: false,
//                 message: "You are not authenticated",
//             });
//         }
//     } catch (e) {
//         return NextResponse.json({
//             success: false,
//             message: "Something went wrong ! Please try again",
//         });
//     }
// }