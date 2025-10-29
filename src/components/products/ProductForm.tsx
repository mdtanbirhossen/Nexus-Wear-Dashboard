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
          reset()
     };





     const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
          } catch (error) {
               console.error("Upload failed:", error);
          }
     };

     return (
          <Card className="p-6 space-y-4 flex gap-4">
               {/* 👇 File input triggers upload automatically */}
               <div className="flex flex-col gap-4 items-center">
                    <Input type="file" accept="image/*" onChange={handleFileChange} />
               </div>


               {/* Left Section - Form Inputs */}
               <form onSubmit={handleSubmit(onSubmit)}>
                    <Card className="md:col-span-2 p-4 gap-2 rounded-sm shadow-none">
                         {/* Name */}
                         <div>
                              <label className="block text-sm font-medium mb-1">Name</label>
                              <Input
                                   type="text"
                                   placeholder="Enter Admin Name"
                                   {...register("name", { required: "Name is required" })}
                                   className="h-12 w-full border border-gray-300 rounded-md"
                              />
                              {errors.name && (
                                   <p className="text-red-500 text-sm mt-1">
                                        {errors.name.message}
                                   </p>
                              )}
                         </div>

                         {/* productCode */}
                         <div>
                              <label className="block text-sm font-medium mb-1">Email</label>
                              <Input
                                   type="text"
                                   placeholder="Enter Admin Email"
                                   {...register("productCode", { required: "productCode is required" })}
                                   className="h-12 w-full border border-gray-300 rounded-md"
                              />
                              {errors.productCode && (
                                   <p className="text-red-500 text-sm mt-1">
                                        {errors.productCode.message}
                                   </p>
                              )}
                         </div>

                         {/* Description */}
                         <div>
                              <label className="block text-sm font-medium mb-1">Phone</label>
                              <Input
                                   type="text"
                                   placeholder="Enter  Description"
                                   {...register("description", { required: "Description is required" })}
                                   className="h-12 w-full border border-gray-300 rounded-md"
                              />
                              {errors.description && (
                                   <p className="text-red-500 text-sm mt-1">
                                        {errors.description.message}
                                   </p>
                              )}
                         </div>

                         {/* Price */}
                         <div>
                              <label className="block text-sm font-medium mb-1">
                                   Price
                              </label>
                              <Input
                                   type="text"
                                   placeholder="Enter Price"
                                   {...register("price", { required: "Price is required" })}
                                   className="h-12 w-full border border-gray-300 rounded-md"
                              />
                              {errors.price && (
                                   <p className="text-red-500 text-sm mt-1">
                                        {errors.price.message}
                                   </p>
                              )}
                         </div>


                         {/* Categories */}
                         <div className="space-y-2">
                              <label>Categories</label>
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
                              <label>subCategories</label>
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
                              <label>Colors</label>
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
                              <label>Sizes</label>
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
                              <label>Status</label>
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


                         <Button>submit</Button>
                    </Card>
               </form>








               {/* Uploaded images preview */}
               {images.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                         {images.map((img, index) => (
                              <img
                                   key={index}
                                   src={img}
                                   alt={`Uploaded ${index + 1}`}
                                   className="w-24 h-24 object-cover rounded-md border"
                              />
                         ))}
                    </div>
               )}
          </Card>
     );
};

export default ProductForm;