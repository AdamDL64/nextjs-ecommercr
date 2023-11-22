"use clietn";

import ComponentLevelLoader from "@/components/Loader/componentlevel";
import { GlobalContext } from "@/context";
import { addToCart } from "@/services/cart";
import { deleteAProduct } from "@/services/product";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { toast } from "react-toastify";

export default function ProductButton({ item }) {
    const pathName = usePathname();
    const isAdminView = pathName.includes("admin-view");
    const { setCurrentUpdatedProduct, setComponentLevelLoader, componentLevelLoader, user ,
        showCartModal, setShowCartModal
    } = useContext(GlobalContext);

    const router = useRouter();

    async function handleDelete(item) {
        setComponentLevelLoader({ loading: true, id: item._id });
        const res = await deleteAProduct(item._id);

        if (res.success) {
            //เสร็จแล้วก็ให้ปิด
            setComponentLevelLoader({ loading: false, id: '' });
            toast.success(res.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
            router.refresh()
        } else {
            toast.error(res.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
            setComponentLevelLoader({ loading: false, id: item._id });

        }
    }

    async function handleAddToCart(getitem) {
        
        setComponentLevelLoader({ loading: true, id: getitem._id })
        const res = await addToCart({ productID: getitem._id, userID: user._id })
        console.log(res)
        if (res.success) {
            toast.success(res.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
            setComponentLevelLoader({ loading: false, id: "" })
            setShowCartModal(true)
            
        } else {
            toast.error(res.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
            setComponentLevelLoader({ loading: false, id: "" })
            setShowCartModal(true)

        }
    }

    return isAdminView ? (
        <>
            <button
                onClick={() => {
                    setCurrentUpdatedProduct(item);
                    router.push("/admin-view/add-product");
                }}
                className="mt-1.5 flex w-full justify-center bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
            >
                Update
            </button>

            <button
                onClick={() => handleDelete(item)}
                className="mt-1.5 flex w-full justify-center bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
            >
                {componentLevelLoader && componentLevelLoader.loading && item._id === componentLevelLoader.id
                    ? <ComponentLevelLoader
                        text={"Deleting Product"}
                        color={"#ffffff"}
                        loading={componentLevelLoader && componentLevelLoader.loading}
                    />
                    : "Delete"
                }


            </button>
        </>
    ) : (
        <>
            <button
                onClick={() => handleAddToCart(item)}
                className="mt-1.5 flex w-full justify-center bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white">
                {componentLevelLoader && componentLevelLoader.loading && item._id === componentLevelLoader.id
                    ? <ComponentLevelLoader
                        text={"Adding to Cart"}
                        color={"#ffffff"}
                        loading={componentLevelLoader && componentLevelLoader.loading}
                    />
                    : "AddToCart"
                }

            </button>
        </>
    );
}
