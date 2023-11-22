"use client";

import InputComponent from "@/components/FormElements/InputComponent";
import SelectComponent from "@/components/FormElements/SelectComponent";
import TileComponent from "@/components/FormElements/TileComponent";
import ComponentLevelLoader from "@/components/Loader/componentlevel";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { addNewProduct, updateAProduct } from "@/services/product";
//firebase
import {
  AvailableSizes,
  adminAddProductformControls,
  firebaseStroageURL,
  // firebaseConfig
} from "@/utils";
import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyAoMwFxJUdV4KMXw-UOf1zm3_rnT76o87s",
  authDomain: "next-js-ecommerce-2023v2.firebaseapp.com",
  projectId: "next-js-ecommerce-2023v2",
  storageBucket: "next-js-ecommerce-2023v2.appspot.com",
  messagingSenderId: "513156355453",
  appId: "1:513156355453:web:a5d33f7b5f200fbf23a814",
  measurementId: "G-QM8T24KCXJ",
};
// export const firebaseStroageURL =
//     "gs://next-js-ecommerce-2023v2.appspot.com";
//set firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app, firebaseStroageURL);

//step 3 firebase ตั้งต่า เวลา วันที่ ชื่อ
const createUniqueFileName = (getFile) => {
  const timeStamp = Date.now();
  const randomStringValue = Math.random().toString(36).substring(2, 12);

  return `${getFile.name}-${timeStamp}-${randomStringValue}`;
};

// step 2 firebase upload
async function helperForUPloadingImageToFirebase(file) {
  const getFileName = createUniqueFileName(file);
  const storageReference = ref(storage, `ecommerce/${getFileName}`);
  const uploadImage = uploadBytesResumable(storageReference, file);

  return new Promise((resolve, reject) => {
    uploadImage.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadImage.snapshot.ref)
          .then((downloadUrl) => resolve(downloadUrl))
          .catch((error) => reject(error));
      }
    );
  });
}
const initialFormData = {
  name: "",
  price: 0,
  description: "",
  category: "men",
  sizes: [],
  deliveryInfo: "",
  onSale: "no",
  imageUrl: "",
  priceDrop: 0,
};

//Man funtion
export default function AdminAddNewProduct() {
  const [formData, setFormData] = useState(initialFormData);

  const { componentLevelLoader, setComponentLevelLoader,
          currentUpdatedProduct, setCurrentUpdatedProduct } =
    useContext(GlobalContext);

    // console.log(currentUpdatedProduct)

    const router = useRouter()

    useEffect(() => {
      if (currentUpdatedProduct !== null) setFormData(currentUpdatedProduct);
    }, [currentUpdatedProduct]);
  


  // step 1 upfireimgae firebase
  async function handleImage(event) {
    // console.log(event.target.files);
    const extractImageUrl = await helperForUPloadingImageToFirebase(
      event.target.files[0]
    );
    // console.log(extractImageUrl);
    if (extractImageUrl) {
      setFormData({
        ...formData,
        imageUrl: extractImageUrl,
      });
    }
  }
  console.log(formData);

  function handleTileClick(getCurrentItem) {
    // console.log(getCurrentItem)

    //copyค่าที่ผู้ใช้ กดเลือก
    let cpySizes = [...formData.sizes];
    const index = cpySizes.findIndex((item) => item.id === getCurrentItem.id);

    //ถ้าไมเจอ return -1  ซึงก็จะเก็บค่าไว

    if (index === -1) {
      cpySizes.push(getCurrentItem);
    } else {
      cpySizes = cpySizes.filter((item) => item.id !== getCurrentItem.id);
    }
    setFormData({
      ...formData,
      sizes: cpySizes,
    });
  }

  // ส่งข้อมูลไปหลังบ้าน
  async function handleAddProduct() {
    //setcomponentlevelLoder ให้ เพื่อแสดงlogding
    setComponentLevelLoader({ loading: true, id: "" });

    const res =
    currentUpdatedProduct !== null
      ? await updateAProduct(formData)
      : await addNewProduct(formData);

  console.log(res);
   
    if (res.success) {
      //เสร็จแล้วก็ให้ปิด
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });

      setFormData(initialFormData);
      setCurrentUpdatedProduct(null)
      setTimeout(()=>{
        router.push('/admin-view/all-products')
      },1000)
    } else {
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setComponentLevelLoader({ loading: false, id: "" });
      setFormData(initialFormData);
    }
    console.log(res);
  }
  console.log(formData);

  return (
    <div className="w-full mt-5 mr-0 mb-0 ml-0 relative">
      <div className="flex flex-col items-start justify-start p-10 bg-white shadow-2xl rounded-xl relative">
        <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-8">
          <input
            accept="image/*"
            max="1000000"
            type="file"
            onChange={handleImage}
          />
          <div className="flex gap-2 flex-col">
            <label>Available sizes</label>
            {/* TileComponent เลือก button size  */}
            <TileComponent
              selected={formData.sizes}
              onClick={handleTileClick}
              data={AvailableSizes}
            />
          </div>
          {
            // เมนู button กรอบข้อมูล
            adminAddProductformControls.map((controlItem) =>
              controlItem.componentType === "input" ? (
                <InputComponent
                  type={controlItem.type}
                  placeholder={controlItem.placeholder}
                  label={controlItem.label}
                  value={formData[controlItem.id]}
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      [controlItem.id]: event.target.value,
                    });
                  }}
                />
              ) : controlItem.componentType === "select" ? (
                <SelectComponent
                  label={controlItem.label}
                  options={controlItem.options}
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      [controlItem.id]: event.target.value,
                    });
                  }}
                />
              ) : null
            )
          }
          <button
            onClick={handleAddProduct}
            className="inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white font-medium uppercase tracking-wide"
          >
            {componentLevelLoader && componentLevelLoader.loading ? (
              <ComponentLevelLoader
                text={currentUpdatedProduct!==null? "Updated Product":"Add Product"}
                color={"#ffffff"}
                loading={componentLevelLoader && componentLevelLoader.loading}
              />
            ) : currentUpdatedProduct !== null ? "Update Product":"Add Product"}
          </button>
        </div>
      </div>
      <Notification />
    </div>
  );
}
