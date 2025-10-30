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

import Image from "next/image";
import { useCreateColorMutation, useGetColorByIdQuery, useUpdateColorDetailsMutation } from "@/redux/api/colorApi/colorApi";
import { Color } from "@/types/color";
import Loading from "../shared/Loading";

const ColorForm = () => {
     /* ---------------------- State & Hooks ---------------------- */
     const [imagePreview, setImagePreview] = useState<string | null>(null);
     const [loading, setLoading] = useState(false)

     const { id } = useParams();
     const router = useRouter();
     const pathname = usePathname();
     const formattedText = pathname.split("/")[2];

     /* ---------------------- API Calls ---------------------- */
     const { data: color } = useGetColorByIdQuery(id);
     const [createColor] = useCreateColorMutation();
     const [updateColorDetails] = useUpdateColorDetailsMutation();

     const colorInfo: Color | undefined = color;


     /* ---------------------- Form Setup ---------------------- */
     const {
          handleSubmit,
          register,
          formState: { errors },
          reset,
     } = useForm<Color>();

     
     useEffect(() => {
          if (colorInfo && formattedText === "update") {
               reset({
                    name: colorInfo.name || "",
                    description: colorInfo.description || "",
               });
          }
     }, [colorInfo, reset, formattedText]);



     /* ---------------------- Submit Handler ---------------------- */
     const onSubmit: SubmitHandler<Color> = async (data) => {
          setLoading(true)
          const formData = new FormData();

          formData.append("name", data.name);
          formData.append("description", data.description);

          // Only include password if creating OR if user typed a new one


          if (data.image && data.image[0]) {
               formData.append("image", data.image[0]);
          }

          try {
               if (formattedText === "create") {
                    const result = await createColor(formData).unwrap();
                    toast.success(`color created successfully`);
               } else {
                    const result = await updateColorDetails({ formData, colorId: id }).unwrap();
                    console.log(result);
                    toast.success(`color updated successfully`);
               }
               router.push("/color");
          } catch (err) {
               console.error("Failed to save color:", err);
               toast.error("Failed to save color");
          } finally {
               setLoading(false)
          }
     };

     /* ---------------------- JSX ---------------------- */
     return (
          <Card className="p-4 rounded-sm gap-4 shadow-none">
               <h1 className="text-xl font-semibold">
                    {formattedText === "update" ? "Update Color Info" : "Create Color"}
               </h1>

               <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white grid grid-cols-1 md:grid-cols-3 gap-4"
               >
                    {/* Left Section - Form Inputs */}
                    <Card className="md:col-span-2 p-4 gap-2 rounded-sm shadow-none">
                         {/* Name */}
                         <div>
                              <label className="block text-sm font-medium mb-1">Color Name</label>
                              <Input
                                   type="text"
                                   placeholder="Enter Color Name"
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
                              <label className="block text-sm font-medium mb-1">Color Description</label>
                              <Input
                                   type="text"
                                   placeholder="Enter Color Description"
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

                    {/* Right Section - Profile Image */}
                    <div className="flex flex-col items-center justify-center border border-gray-200 rounded-sm p-4 relative">
                         <div className="flex flex-col items-center">
                              {/* Image Preview */}
                              {imagePreview ? (
                                   <div className="relative w-32 h-32">
                                        <Image
                                             src={imagePreview}
                                             alt="Profile Preview"
                                             width={500}
                                             height={100}
                                             quality={75}
                                             className="w-full h-full object-cover rounded-full mb-4 border border-gray-300"
                                             draggable={false}
                                        />
                                        <button
                                             type="button"
                                             onClick={() => setImagePreview(null)}
                                             className="absolute top-1 right-1 bg-red-600 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full shadow-md hover:bg-red-700"
                                        >
                                             ✕
                                        </button>
                                   </div>
                              ) : colorInfo?.image ? (
                                   <div className="relative w-32 h-32">
                                        <Image
                                             src={colorInfo.image}
                                             alt="Profile Preview"
                                             width={500}
                                             height={100}
                                             quality={75}
                                             className="w-full h-full object-cover rounded-full mb-4 border border-gray-300"
                                             draggable={false}
                                        />
                                   </div>
                              ) : (
                                   <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-full mb-4 border border-gray-300">
                                        <span className="text-gray-400">No Image</span>
                                   </div>
                              )}
                         </div>

                         {/* Upload Input */}
                         <div className="w-full">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition">
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
                                        {...register("image", {
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
                                             onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                                  const file = e.target.files?.[0];
                                                  if (file) {
                                                       setImagePreview(URL.createObjectURL(file));
                                                  }
                                             },
                                        })}
                                        className="h-12 hidden"
                                   />
                                   {errors.image && (
                                        <p className="text-red-500 text-sm mt-1">
                                             {errors.image.message}
                                        </p>
                                   )}
                              </label>
                         </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="md:col-span-3 flex justify-end gap-2">
                         <Button
                              type="button"
                              onClick={() => router.back()}
                              className="bg-gray-600"
                         >
                              Go Back
                         </Button>
                         <Button disabled={loading} type="submit" >
                              {
                                   loading ? <Loading /> : formattedText === "update" ? "Update" : "Create "
                              }
                         </Button>
                    </div>
               </form>
          </Card>
     );
};

export default ColorForm;
