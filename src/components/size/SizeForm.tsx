"use client";

import React, { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

// UI Components
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

// Redux API

import { Size} from "@/types/size";
import { useCreateSizeMutation, useGetSizeByIdQuery, useUpdateSizeDetailsMutation } from "@/redux/api/sizeApi/sizeApi";

const SizeForm = () => {
     /* ---------------------- State & Hooks ---------------------- */

     const { id } = useParams();
     const router = useRouter();
     const pathname = usePathname();
     const formattedText = pathname.split("/")[2];

     /* ---------------------- API Calls ---------------------- */
     const { data: size } = useGetSizeByIdQuery(id);
     const [createSize] = useCreateSizeMutation();
     const [updateSizeDetails] = useUpdateSizeDetailsMutation();

     const sizeInfo: Size | undefined = size;


     /* ---------------------- Form Setup ---------------------- */
     const {
          handleSubmit,
          register,
          formState: { errors },
          reset,
     } = useForm<Size>();

     
     useEffect(() => {
          if (sizeInfo && formattedText === "update") {
               reset({
                    name: sizeInfo.name || "",
                    description: sizeInfo.description || "",
               });
          }
     }, [sizeInfo, reset, formattedText]);



     /* ---------------------- Submit Handler ---------------------- */
     const onSubmit: SubmitHandler<Size> = async (data) => {
          const formData = new FormData();

          formData.append("name", data.name);
          formData.append("description", data.description);



          try {
               if (formattedText === "create") {
                    const result = await createSize(formData).unwrap();
                    toast.success(`size created successfully`);
               } else {
                    const result = await updateSizeDetails({ formData, sizeId: id }).unwrap();
                    console.log(result);
                    toast.success(`size updated successfully`);
               }
               router.push("/size");
          } catch (err) {
               console.error("Failed to save size:", err);
               toast.error("Failed to save size");
          }
     };

     /* ---------------------- JSX ---------------------- */
     return (
          <Card className="p-4 rounded-sm gap-4 shadow-none">
               <h1 className="text-xl font-semibold">
                    {formattedText === "update" ? "Update size Info" : "Create size"}
               </h1>

               <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white grid grid-cols-1 md:grid-cols-3 gap-4"
               >
                    {/* Left Section - Form Inputs */}
                    <Card className="md:col-span-3 p-4 gap-2 rounded-sm shadow-none">
                         {/* Name */}
                         <div>
                              <label className="block text-sm font-medium mb-1">size Name</label>
                              <Input
                                   type="text"
                                   placeholder="Enter size Name"
                                   {...register("name", { required: "Name is required" })}
                                   className="h-12 w-full border border-gray-300 rounded-md"
                              />
                              {errors.name && (
                                   <p className="text-red-500 text-sm mt-1">
                                        {errors.name.message}
                                   </p>
                              )}
                         </div>

                         {/* description */}
                         <div>
                              <label className="block text-sm font-medium mb-1">size Description</label>
                              <Input
                                   type="text"
                                   placeholder="Enter size Description"
                                   {...register("description", { required: "description is required" })}
                                   className="h-12 w-full border border-gray-300 rounded-md"
                              />
                              {errors.description && (
                                   <p className="text-red-500 text-sm mt-1">
                                        {errors.description.message}
                                   </p>
                              )}
                         </div>


                    </Card>


                    {/* Action Buttons */}
                    <div className="md:col-span-3 flex justify-end gap-2">
                         <Button
                              type="button"
                              onClick={() => router.back()}
                              className="bg-gray-600"
                         >
                              Go Back
                         </Button>
                         <Button type="submit" className="bg-blue-600">
                              {formattedText === "update" ? "Update" : "Create "}
                         </Button>
                    </div>
               </form>
          </Card>
     );
};

export default SizeForm;
