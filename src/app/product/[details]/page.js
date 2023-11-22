import CommonDetails from "@/components/ComomDetails"
import { productById } from "@/services/product"



//ใช้ params เพื่อทำให้มันได้นามิ
export default async function ProductDetails({params}){

const productDetailsData = await productById(params.details)
    console.log(productDetailsData ,'productDetailData')
return <CommonDetails item={productDetailsData && productDetailsData.data} />
}