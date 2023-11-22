'use client'

import { GlobalContext } from "@/context";
import { adminNavOptions, navOptions } from "@/utils";
import { Fragment, useContext, useEffect } from "react";
import CommonModal from "../CommonModal";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import CartModal from "../CartModal";
import Image from "next/image";

// const isAdminView = false;
// const isAuthUser = true;
// const user = {
//     role: 'admin'
// }

//menu ตรงกลาง
function NavItems({ isModalView = false, isAdminView, router }) {
    //isModalView รับมาจาก ตอนที่เรียน commomModal โดยจะกำหนดค่าเริ่มต้นให้มัน เป็น flase
    return (
        <div className={`items-center justify-between w-full md:flex md:w-auto ${isModalView ? "" : "hidden"
            }`}
            id="nav-items">
            <ul className={`flex flex-col p-4 md:p-0 mt-4 font-medium  rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-white ${isModalView ? "border-none" : "border-gray-100"}`}>
                {
                    // check admin or user
                    isAdminView ? adminNavOptions.map(item => <li
                        key={item.id}
                        className="hover:text-blue-500 cursor-pointer block py-2 pl-3 pr-4 text-gray-900 rounded md:p-0"
                        onClick={() => router.push(item.path)}

                    >
                        {item.label}
                    </li>) :
                        navOptions.map(item => <li
                            key={item.id}
                            className="hover:text-blue-500 cursor-pointer block py-2 pl-3 pr-4 text-gray-900 rounded md:p-0"
                            onClick={() => router.push(item.path)}
                        >
                            {item.label}
                        </li>)
                }
            </ul>
        </div>
    )


}

export default function Navbar() {

    const { showNavModal, setShowNavModal,
        user, setUser
        , isAuthUser, setIsAuthUser,
        currentUpdatedProduct, setCurrentUpdatedProduct,
        showCartModal,
        setShowCartModal
    } = useContext(GlobalContext)

    const router = useRouter()
    const pathName = usePathname()

    // console.log(user, isAuthUser, 'Nav')
    console.log(pathName, '=pathname')

    useEffect(() => {
        if (
            pathName !== "/admin-view/add-product" &&
            currentUpdatedProduct !== null
        )
            setCurrentUpdatedProduct(null);
    }, [pathName]);


    function handleLogout() {

        setIsAuthUser(false)
        setUser(null)
        //ลบข้อมูลcookic
        Cookies.remove('token')
        localStorage.clear()
        router.push('/')
    }
    //includes ค้นหา หาเจอ = true
    const isAdminView = pathName.includes('admin-view')


    return <>
        <nav className="bg-white fixed w-full z-20 top-0 left-0 border-b border-gray-200">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <div className="flex items-center cursor-pointer"
                    onClick={() => router.push('/')}
                >    <Image src="/assets/logo.png" width={100} height={100} alt="logo" className="mb-2 gap-6 rounded-full" />
                    <span className=" hover:text-blue-500 slef-center text-2xl font-semibold whitespace-nowrap text-red-800">
                        Ecommercery
                    </span>

                </div>
                {/* check auth account login user or admin */}
                <div className="flex md:order-2 gap-2">
                    {!isAdminView && isAuthUser ? <Fragment>

                        <button className={"hover:text-blue-500 mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"}
                        onClick={()=>router.push('/account')}
                        >Account</button>

                        <button className={"hover:text-blue-500 mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"}
                        onClick={()=>setShowCartModal(true)}
                        >Cart</button>
                    </Fragment>
                        : null}
                    {/* check user or admin */}
                    {
                        user?.role === 'admin' ?
                            isAdminView ?
                                <button className="hover:text-blue-500 mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium upprcase tracking-wide text-white"
                                    onClick={() => router.push('/')}
                                >Client View</button>
                                : <button className={"hover:text-blue-500 mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"}
                                    onClick={() => router.push('/admin-view')}
                                >Admin View</button>
                            : null
                    }

                    {/* chexk login or logout */}
                    {
                        isAuthUser ? <button className={"hover:text-blue-500 mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"}
                            onClick={handleLogout}
                        >
                            LogOut
                        </button>
                            : <button className={"hover:text-blue-500 mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"}
                                onClick={() => router.push('/login')}
                            >Login
                            </button>
                    }
                    {/* icons button menu */}
                    <button
                        data-collapse-toggle="navbar-sticky"
                        type="button"
                        className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-sticky"
                        aria-expanded="false"
                        // click button menu
                        onClick={() => setShowNavModal(true)}

                    >
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className="w-6 h-6"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clip-rule="evenodd"
                            ></path>
                        </svg>
                    </button>

                </div>
                <NavItems isAdminView={isAdminView} router={router} />
            </div>
        </nav>
        <CommonModal
            showModalTitle={false}
            mainContent={<NavItems router={router} isModalView={true} isAdminView={isAdminView} />}
            show={showNavModal} setShow={setShowNavModal} />
        {
            showCartModal && <CartModal />
        }
    </>

}