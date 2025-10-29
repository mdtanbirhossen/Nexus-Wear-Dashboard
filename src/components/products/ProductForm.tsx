"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useUploadImagesMutation } from "@/redux/api/imagesUploadApi/imagesUploadApi";
import { Product } from "@/types/product";
import { useGetAllColorsQuery } from "@/redux/api/colorApi/colorApi";
import { usePathname, useRouter } from "next/navigation";
import { useCreateProductMutation } from "@/redux/api/productsApi/productsApi";
import { SubmitHandler, useForm } from "react-hook-form";
import { Color } from "@/types/color";
import { Label } from "../ui/label";
import { useGetAllsizesQuery } from "@/redux/api/sizeApi/sizeApi";
import { Size } from "@/types/size";
import { useGetAllCategoriesQuery } from "@/redux/api/categoryApi/categoryApi";
import { Category, Subcategory } from "@/types/categoryAndSubcategory";
import { useGetAllSubCategoriesQuery } from "@/redux/api/subCategoryApi/subCategoryApi";
import Select from "react-select";
import Image from "next/image";
import Loading from "../shared/Loading";

const ProductForm = () => {
     const [images, setImages] = useState<string[]>([]);
     const [uploadImages] = useUploadImagesMutation();
     const [loading, setLoading] = useState(false)
     const router = useRouter();
     const pathname = usePathname();
     const formattedText = pathname.split("/")[2];



     /* ---------------------- API Calls ---------------------- */
     const [createProduct] = useCreateProductMutation();

     const { data: colorData } = useGetAllColorsQuery(undefined);
     const { data: sizeData } = useGetAllsizesQuery(undefined);
     const { data: categoryData } = useGetAllCategoriesQuery(undefined);
     const { data: subCategoryData } = useGetAllSubCategoriesQuery(undefined);


     // categories
     const categories: Category[] = categoryData?.data || [];
     const categoryOptions = categories.map(category => ({
          value: category.id,
          label: category.name,
     }));

     // subCategories
     const subCategories: Subcategory[] = subCategoryData?.data || [];
     const subCategoryOptions = subCategories.map(subCategory => ({
          value: subCategory.id,
          label: subCategory.name,
     }));

     // colors
     const colors: Color[] = colorData?.data || [];
     const colorOptions = colors.map(color => ({
          value: color.id,
          label: color.name,
     }));

     // sizes
     const sizes: Size[] = sizeData?.data || [];
     const sizeOptions = sizes.map(size => ({
          value: size.id,
          label: size.name,
     }));

     // statusOption
     const statusOptions = [
          { value: 'published', label: "PUBLISHED" },
          { value: 'out_of_stock', label: "OUT_OF_STOCK" },
          { value: 'in_stock', label: "IN_STOCK" },
          { value: 'discontinued', label: "DISCONTINUED" },
          { value: 'up_coming', label: "UP_COMING" },
     ];






     /* ---------------------- Form Setup ---------------------- */

     const {
          handleSubmit,
          register,
          formState: { errors },
          setValue,
          reset,
     } = useForm<Product>();


     /* ---------------------- Submit Handler ---------------------- */
     const onSubmit: SubmitHandler<Product> = async (data) => {
          console.log(data);
          // const formData = new FormData();

          // formData.append("name", data.name);
          // formData.append("email", data.email);
          // formData.append("description", data.phone);
          // formData.append("price", data.price);
          // formData.append("addressLine", data.addressLine);
          // formData.append("roleId", String(data.roleId));
          // formData.append("status", data.status);

          // // Only include password if creating OR if user typed a new one
          // if (formattedText === "create" || data.password) {
          //      formData.append("password", data.password);
          // }

          // if (data.image && data.image[0]) {
          //      formData.append("image", data.image[0]);
          // }

          // try {
          //      if (formattedText === "create") {
          //           const result = await createProduct(formData).unwrap();
          //           toast.success(`${result.data.role.name} created successfully`);
          //      } else {
          //           const result = await updateAdminDetails({ formData, adminId: id }).unwrap();
          //           console.log(result);
          //           toast.success(`${result.data.role.name} updated successfully`);
          //      }
          //      router.push("/admin");
          // } catch (err) {
          //      console.error("Failed to save admin:", err);
          //      toast.error("Failed to save admin");
          // }
          // reset()
     };





     const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
          setLoading(true)
          const file = e.target.files?.[0];
          if (!file) return;

          const formData = new FormData();
          formData.append("file", file);

          try {
               const result = await uploadImages(formData).unwrap();
               const imageUrl =
                    typeof result === "string"
                         ? result
                         : result?.data || result?.url;

               setImages((prev) => [...prev, imageUrl]);
               reset()
          } catch (error) {
               console.error("Upload failed:", error);
          } finally {
               setLoading(false)
          }
     };

     return (
          <Card className="p-6 space-y-4 flex gap-4">

               {/* Left Section - Form Inputs */}
               <form onSubmit={handleSubmit(onSubmit)}>
                    <Card className="md:col-span-2 p-4 gap-2 rounded-sm shadow-none ">


                         {/* image upload section */}
                         <div className="w-full">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300  cursor-pointer hover:bg-gray-50 transition">
                                   <div className="flex flex-col items-center justify-center">
                                        <p className="text-sm text-gray-500">
                                             <span className="font-semibold">Click to upload</span> or drag
                                             & drop
                                        </p>
                                        <p className="text-xs text-gray-400">PNG, JPG (max 2MB)</p>
                                   </div>
                                   <Input
                                        type="file"
                                        accept="image/*"
                                        {...register("file", {
                                             validate: {
                                                  lessThan2MB: (value) => {
                                                       const files = value as unknown as FileList;
                                                       return (
                                                            !files?.[0] ||
                                                            files[0].size <= 2_000_000 ||
                                                            "File size should be less than 2MB"
                                                       );
                                                  },
                                             },
                                        })}
                                        onChange={handleFileChange}
                                        className=" hidden"
                                   />
                                   {errors.file && (
                                        <p className="text-red-500 text-sm mt-1">
                                             {errors.file.message}
                                        </p>
                                   )}
                              </label>
                         </div>

                         {/* Uploaded images preview */}
                         <div className="flex gap-4">
                              {images.length > 0 && (
                                   <div className="flex flex-wrap gap-3 mt-4">
                                        {images.map((img, index) => (
                                             <Image
                                                  key={index}
                                                  src={img}
                                                  alt={`Uploaded ${index + 1}`}
                                                  width={100}
                                                  height={100}
                                                  className="w-24 h-24 object-contain rounded-b-md border"
                                             />
                                        ))}
                                   </div>
                              )}
                              {
                                   loading && (
                                        <div className="w-24 h-24  rounded-b-md border bg-gray-200 mt-4 flex items-center  justify-center">
                                           <Loading />
                                        </div>
                                   )
                              }
                         </div>





                         {/* Name */}
                         <div>
                              <Label className="block text-sm font-medium mb-1">Name</Label>
                              <Input
                                   type="text"
                                   placeholder="Enter Admin Name"
                                   {...register("name", { required: "Name is required" })}
                                   className=" w-full border border-gray-300 "
                              />
                              {errors.name && (
                                   <p className="text-red-500 text-sm mt-1">
                                        {errors.name.message}
                                   </p>
                              )}
                         </div>

                         {/* productCode */}
                         <div>
                              <Label className="block text-sm font-medium mb-1">Email</Label>
                              <Input
                                   type="text"
                                   placeholder="Enter Admin Email"
                                   {...register("productCode", { required: "productCode is required" })}
                                   className=" w-full border border-gray-300 "
                              />
                              {errors.productCode && (
                                   <p className="text-red-500 text-sm mt-1">
                                        {errors.productCode.message}
                                   </p>
                              )}
                         </div>

                         {/* Description */}
                         <div>
                              <Label className="block text-sm font-medium mb-1">Phone</Label>
                              <Input
                                   type="text"
                                   placeholder="Enter  Description"
                                   {...register("description", { required: "Description is required" })}
                                   className=" w-full border border-gray-300 "
                              />
                              {errors.description && (
                                   <p className="text-red-500 text-sm mt-1">
                                        {errors.description.message}
                                   </p>
                              )}
                         </div>

                         {/* Price */}
                         <div>
                              <Label className="block text-sm font-medium mb-1">
                                   Price
                              </Label>
                              <Input
                                   type="text"
                                   placeholder="Enter Price"
                                   {...register("price", { required: "Price is required" })}
                                   className=" w-full border border-gray-300 "
                              />
                              {errors.price && (
                                   <p className="text-red-500 text-sm mt-1">
                                        {errors.price.message}
                                   </p>
                              )}
                         </div>


                         {/* Categories */}
                         <div className="space-y-2">
                              <Label className="block text-sm font-medium mb-1">Categories</Label>
                              <Select
                                   options={categoryOptions}
                                   onChange={(selected) => {
                                        setValue(
                                             "categoryId", Number(selected?.value)
                                        );
                                   }}
                                   placeholder="Select colors..."
                              />
                              {errors.categoryId && (
                                   <p className="text-red-500 text-sm">{errors.categoryId.message}</p>
                              )}

                         </div>

                         {/* subCategories */}
                         <div className="space-y-2">
                              <Label className="block text-sm font-medium mb-1">Sub Categories</Label>
                              <Select
                                   options={subCategoryOptions}
                                   onChange={(selected) => {
                                        setValue(
                                             "subcategoryId", Number(selected?.value)
                                        );
                                   }}
                                   placeholder="Select colors..."
                              />
                              {errors.subcategoryId && (
                                   <p className="text-red-500 text-sm">{errors.subcategoryId.message}</p>
                              )}
                         </div>

                         {/* Colors */}
                         <div className="space-y-2">
                              <Label className="block text-sm font-medium mb-1">Colors</Label>
                              <Select
                                   isMulti
                                   options={colorOptions}
                                   onChange={(selected) => {
                                        setValue(
                                             "colorIds",
                                             selected.map(item => item.value)
                                        );
                                   }}
                                   placeholder="Select colors..."
                              />
                              {errors.colorIds && (
                                   <p className="text-red-500 text-sm">{errors.colorIds.message}</p>
                              )}
                         </div>

                         {/* sizes */}
                         <div className="space-y-2">
                              <Label className="block text-sm font-medium mb-1">Sizes</Label>
                              <Select
                                   isMulti
                                   options={sizeOptions}
                                   onChange={(selected) => {
                                        setValue(
                                             "sizeIds",
                                             selected.map(item => item.value)
                                        );
                                   }}
                                   placeholder="Select sizes..."
                              />
                              {errors.sizeIds && (
                                   <p className="text-red-500 text-sm">{errors.sizeIds.message}</p>
                              )}
                         </div>

                         {/* availability */}
                         <div className="space-y-2">
                              <Label className="block text-sm font-medium mb-1">Status</Label>
                              <Select
                                   options={statusOptions}
                                   onChange={(selected) => {
                                        setValue(
                                             "availability", String(selected?.value)
                                        );
                                   }}
                                   placeholder="Select Status..."
                              />
                              {errors.categoryId && (
                                   <p className="text-red-500 text-sm">{errors.categoryId.message}</p>
                              )}
                         </div>


                         <Button className="mt-4">Submit</Button>
                    </Card>
               </form>








          </Card>
     );
};

export default ProductForm;