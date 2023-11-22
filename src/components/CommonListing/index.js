"use client";

import { useRouter } from "next/navigation";
import ProductTile from "./ProductTile";
import ProductButton from "./ProduuctButtons";
import { useEffect } from "react";
import Notification from "../Notification";

// const dummyData = [
//     {
//         _id: "6526a28110dca63ccd9c5867",
//         name: "sdf",
//         description: "werw",
//         price: 34,
//         category: "women",
//         sizes: [
//             {
//                 id: "s",
//                 label: "S",
//             },
//         ],
//         deliveryInfo: "sdfsdf",
//         onSale: "no",
//         priceDrop: 12,
//         imageUrl:
//             "https://firebasestorage.googleapis.com/v0/b/next-js-ecommerce-2023v2.appspot.com/o/ecommerce%2Fimages.jpg-1697030781612-tf2x9mti1s?alt=media&token=a2a87a68-69cb-4002-945e-ffbc961c45ac",
//     },
// ];

export default function CommonListing({ data }) {
    const router = useRouter()
    useEffect(()=>{
        router.refresh()
    },[])
    return (
        <section className=" py-12 sm:py-16">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4 lg:mt-16">
                    {data && data.length
                        ? data.map((item) => (
                            <article
                                className="relative flex flex-col overflow-hidden border cursor-pointer bg-white"
                                key={item._id}
                                
                            >
                                <ProductTile item={item} />
                                <ProductButton item={item} />
                            </article>
                        ))
                        : "null"}
                </div>
            </div>
            <Notification />
        </section>
    );
}
