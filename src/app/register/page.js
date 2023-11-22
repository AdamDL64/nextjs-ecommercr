'use client'

import InputComponent from "@/components/FormElements/InputComponent";
import SelectComponent from "@/components/FormElements/SelectComponent";
import ComponentLevelLoader from "@/components/Loader/componentlevel";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { registerNewUser } from "@/services/register";
import { registrationFormControls } from "@/utils";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

// const isRegistered = false;

const initialFromData = {
    name: "",
    email: "",
    password: "",
    role: "customer",
};

export default function Register() {
    const [formData, setFormData] = useState(initialFromData);
    const [isRegistered, setIsRegistered] = useState(false)
    const { pageLevelLoader, setPageLevelLoader,isAuthUser } = useContext(GlobalContext)

    const router = useRouter()
    console.log(formData, "Formdata at regiser page");

    //check ว่ามีการใสข้อมูลครบไหม ไวเช็ก disable ตรงที่ register

    function isFormValid() {
        return formData &&
            formData.name &&
            formData.name.trim() !== "" &&
            formData.email &&
            formData.email.trim() !== "" &&
            formData.password &&
            formData.password.trim() !== ""
            ? true
            : false;

    }
    // console.log(isFormValid())

    async function handleRegisterOnSubmit() {
        setPageLevelLoader(true)
        //ส่งข้อมูลไปหลังบ้าน
        const data = await registerNewUser(formData)
        //load ก่อน
        
        console.log(data, 'data')
        if (data.success) {
            toast.success(data.message, {
                position: toast.POSITION.TOP_RIGHT
            })
            setIsRegistered(true)
            setPageLevelLoader(false)
            //resetให้เป็นค่าเริ่มต้นใหม่
            setFormData(initialFromData)
        } else {
            toast.error(data.message, {
                position: toast.POSITION.TOP_RIGHT
            })
            setPageLevelLoader(false)
        }

        console.log(pageLevelLoader)
        console.log(data)
    }

    useEffect(() => {
        if (isAuthUser) router.push('/')
    }, [isAuthUser])


    return (
        <div className="bg-gray-100 relative">
            <div className="flex flex-col items-center justify-between pt-0 pr-0 pl-10 mt-8 mr-auto  xl:px-5 lg:flex-row">
                <div className="flex flex-col justify-center items-center w-full pr-10 pl-10 lg:flex-row">
                    <div className="w-full mt-10 mr-0 mb-0 ml-0 relative max-w-2xl lg:mt-0 lg:w-5/12">
                        <div className="flex flex-col items-center justify-start pt-10 pr-10 pb-10 pl-10 bg-white shadow-2xl rounded-xl relative z-10">
                            <p className="w-full text-4xl font-medium text-center font-serif">
                                {isRegistered
                                    ? "RegistrationSuccessFully"
                                    : "sign up for account"}
                            </p>
                            {isRegistered ? (
                                <button
                                    className="inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg
                                text-white transition duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide hover:text-blue-500"
                                onClick={()=>router.push('/login/')}
                                >
                                    Login
                                </button>
                            ) : (
                                <div className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                                    {registrationFormControls.map((controlItem) =>
                                        controlItem.componentType === "input" ? (
                                            <InputComponent
                                                type={controlItem.type}
                                                placeholder={controlItem.placeholder}
                                                label={controlItem.label}
                                                onChange={(event) => {
                                                    setFormData({
                                                        ...formData,
                                                        [controlItem.id]: event.target.value,
                                                    });
                                                }}
                                                value={formData[controlItem.id]}
                                            />
                                        ) : controlItem.componentType === "select" ? (
                                            <SelectComponent
                                                options={controlItem.options}
                                                label={controlItem.label}
                                                onChange={(event) => {
                                                    setFormData({
                                                        ...formData,
                                                        [controlItem.id]: event.target.value,
                                                    });
                                                }}
                                                value={formData[controlItem.id]}
                                            />
                                        ) : null
                                    )}
                                    <button
                                        className=" disabled:opacity-50 inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg
                                        text-white transition duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide hover:text-blue-500"
                                        disabled={!isFormValid()}
                                        onClick={handleRegisterOnSubmit}
                                    >
                                        {
                                            pageLevelLoader ? (<ComponentLevelLoader
                                                text={'Regitering'}
                                                color={'#ffffff'}
                                                loading={pageLevelLoader}
                                            /> ): "Register"
                                        }
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Notification />
        </div>
    );
}
