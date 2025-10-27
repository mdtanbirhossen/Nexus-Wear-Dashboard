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
import { useGetAllRolesQuery } from "@/redux/api/roleApi/roleApi";
import {
     useCreateAdminMutation,
     useGetAdminByIdQuery,
     useUpdateAdminDetailsMutation,
} from "@/redux/api/adminApi/adminApi";

// Types
import { Role } from "@/types/role";
import { Admin } from "@/types/admin";
import Image from "next/image";

const AdminForm = () => {
     /* ---------------------- State & Hooks ---------------------- */
     const [imagePreview, setImagePreview] = useState<string | null>(null);

     const { id } = useParams();
     const router = useRouter();
     const pathname = usePathname();
     const formattedText = pathname.split("/")[2];

     /* ---------------------- API Calls ---------------------- */
     const { data: roleData } = useGetAllRolesQuery(undefined);
     const { data: admin } = useGetAdminByIdQuery(id);
     const [createAdmin] = useCreateAdminMutation();
     const [updateAdminDetails] = useUpdateAdminDetailsMutation();

     const roles: Role[] = roleData || [];
     const adminInfo: Admin | undefined = admin;

     /* ---------------------- Form Setup ---------------------- */
     const {
          handleSubmit,
          register,
          formState: { errors },
          reset,
     } = useForm<Admin>();

     
     useEffect(() => {
          if (adminInfo && formattedText === "update") {
               reset({
                    name: adminInfo.name || "",
                    email: adminInfo.email || "",
                    phone: adminInfo.phone || "",
                    nationalId: adminInfo.nationalId || "",
                    addressLine: adminInfo.addressLine || "",
                    status: adminInfo.status || "active",
                    roleId: adminInfo.roleId || "",
                    password: "", // keep empty for update
               });
          }
     }, [adminInfo, reset, formattedText]);



     /* ---------------------- Submit Handler ---------------------- */
     const onSubmit: SubmitHandler<Admin> = async (data) => {
          const formData = new FormData();

          formData.append("name", data.name);
          formData.append("email", data.email);
          formData.append("phone", data.phone);
          formData.append("nationalId", data.nationalId);
          formData.append("addressLine", data.addressLine);
          formData.append("roleId", String(data.roleId));
          formData.append("status", data.status);

          // Only include password if creating OR if user typed a new one
          if (formattedText === "create" || data.password) {
               formData.append("password", data.password);
          }

          if (data.image && data.image[0]) {
               formData.append("image", data.image[0]);
          }

          try {
               if (formattedText === "create") {
                    const result = await createAdmin(formData).unwrap();
                    toast.success(`${result.data.role.name} created successfully`);
               } else {
                    const result = await updateAdminDetails({ formData, adminId: id }).unwrap();
                    console.log(result);
                    toast.success(`${result.data.role.name} updated successfully`);
               }
               router.push("/admin");
          } catch (err) {
               console.error("Failed to save admin:", err);
               toast.error("Failed to save admin");
          }
     };

     /* ---------------------- JSX ---------------------- */
     return (
          <Card className="p-4 rounded-sm gap-4 shadow-none">
               <h1 className="text-xl font-semibold">
                    {formattedText === "update" ? "Update Admin Info" : "Create Admin"}
               </h1>

               <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white grid grid-cols-1 md:grid-cols-3 gap-4"
               >
                    {/* Left Section - Form Inputs */}
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

                         {/* Email */}
                         <div>
                              <label className="block text-sm font-medium mb-1">Email</label>
                              <Input
                                   type="email"
                                   placeholder="Enter Admin Email"
                                   {...register("email", { required: "Email is required" })}
                                   className="h-12 w-full border border-gray-300 rounded-md"
                              />
                              {errors.email && (
                                   <p className="text-red-500 text-sm mt-1">
                                        {errors.email.message}
                                   </p>
                              )}
                         </div>

                         {/* Phone */}
                         <div>
                              <label className="block text-sm font-medium mb-1">Phone</label>
                              <Input
                                   type="tel"
                                   placeholder="Enter Phone Number"
                                   {...register("phone", { required: "Phone is required" })}
                                   className="h-12 w-full border border-gray-300 rounded-md"
                              />
                              {errors.phone && (
                                   <p className="text-red-500 text-sm mt-1">
                                        {errors.phone.message}
                                   </p>
                              )}
                         </div>

                         {/* National ID */}
                         <div>
                              <label className="block text-sm font-medium mb-1">
                                   National Id
                              </label>
                              <Input
                                   type="text"
                                   placeholder="Enter National Id"
                                   {...register("nationalId", { required: "National ID is required" })}
                                   className="h-12 w-full border border-gray-300 rounded-md"
                              />
                              {errors.nationalId && (
                                   <p className="text-red-500 text-sm mt-1">
                                        {errors.nationalId.message}
                                   </p>
                              )}
                         </div>

                         {/* Address */}
                         <div>
                              <label className="block text-sm font-medium mb-1">Address</label>
                              <Input
                                   type="text"
                                   placeholder="Enter Address"
                                   {...register("addressLine", { required: "Address is required" })}
                                   className="h-12 w-full border border-gray-300 rounded-md"
                              />
                              {errors.addressLine && (
                                   <p className="text-red-500 text-sm mt-1">
                                        {errors.addressLine.message}
                                   </p>
                              )}
                         </div>

                         {/* Password */}
                         <div>
                              <label className="block text-sm font-medium mb-1">Password</label>
                              <Input
                                   type="password"
                                   placeholder="(optional) if already have"
                                   {...register("password")}
                                   className="h-12 w-full border border-gray-300 rounded-md"
                              />
                         </div>

                         {/* Role */}
                         <div className="space-y-2">
                              <Label htmlFor="role">Role</Label>
                              <select
                                   id="role"
                                   defaultValue=""
                                   {...register("roleId", { required: "Role is required" })}
                                   className="h-12 w-full border border-gray-300 rounded-md px-2 appearance-none"
                              >
                                   <option value="" disabled>
                                        Select role
                                   </option>
                                   {roles.map((item) => (
                                        <option key={item.id} value={item.id}>
                                             {item.name}
                                        </option>
                                   ))}
                              </select>
                              {errors.roleId && (
                                   <p className="text-red-500 text-sm">{errors.roleId.message}</p>
                              )}
                         </div>

                         {/* Status */}
                         <div className="space-y-2">
                              <Label htmlFor="status">Status</Label>
                              <select
                                   id="status"
                                   defaultValue=""
                                   {...register("status", { required: "Status is required" })}
                                   className="h-12 w-full border border-gray-300 rounded-md px-2 appearance-none"
                              >
                                   <option value="" disabled>
                                        Select status
                                   </option>
                                   <option value="active">Active</option>
                                   <option value="pending">Pending</option>
                                   <option value="inactive">Inactive</option>
                                   <option value="deleted">Deleted</option>
                              </select>
                              {errors.status && (
                                   <p className="text-red-500 text-sm">{errors.status.message}</p>
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
                              ) : adminInfo?.image ? (
                                   <div className="relative w-32 h-32">
                                        <Image
                                             src={adminInfo.image}
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
                         <Button type="submit" className="bg-blue-600">
                              {formattedText === "update" ? "Update" : "Create "}
                         </Button>
                    </div>
               </form>
          </Card>
     );
};

export default AdminForm;
