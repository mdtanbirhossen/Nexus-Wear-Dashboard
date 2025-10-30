"use client";

import React, { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

// UI Components
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

// Redux API
import { useCreateRoleMutation, useGetRoleByIdQuery, useUpdateRoleDetailsMutation } from "@/redux/api/roleApi/roleApi";

// Types
import { Role } from "@/types/role";
import Loading from "../shared/Loading";

const RoleForm = () => {

     const { id }: { id: string } = useParams();
     const router = useRouter();
     const pathname = usePathname();
     const formattedText = pathname.split("/")[2];
     const [loading, setLoading] = useState(false)

     /* ---------------------- API Calls ---------------------- */
     const { data: role } = useGetRoleByIdQuery(id);
     const [createRole] = useCreateRoleMutation();
     const [updateRoleDetails] = useUpdateRoleDetailsMutation();

     const roleInfo: Role | undefined = role;

     /* ---------------------- Form Setup ---------------------- */
     const {
          handleSubmit,
          register,
          formState: { errors },
          reset,
     } = useForm<Role>();

     useEffect(() => {
          if (roleInfo && formattedText === "update") {
               reset({
                    name: roleInfo.name || "",
                    description: roleInfo.description || "",
               });
          }
     }, [roleInfo, reset, formattedText]);


     /* ---------------------- Submit Handler ---------------------- */
     const onSubmit: SubmitHandler<Role> = async (data) => {
          setLoading(true)

          const roleData = {
               name: data.name,
               description: data.description,
          }

          try {
               if (formattedText === "create") {
                    await createRole(roleData).unwrap();
                    toast.success(`role created successfully`);
               } else {
                    if (id) {
                         await updateRoleDetails({ roleId: id, ...roleData }).unwrap();
                         toast.success(`role updated successfully`);
                    }
               }
               router.push("/role");
          } catch (err) {
               console.error("Failed to save role:", err);
               toast.error("Failed to save role");
          } finally {
               setLoading(false)
          }
     };

     /* ---------------------- JSX ---------------------- */
     return (
          <Card className="p-4 rounded-sm gap-4 shadow-none">
               <h1 className="text-xl font-semibold">
                    {formattedText === "update" ? "Update Role Details" : "Create Role"}
               </h1>

               <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white grid grid-cols-1 md:grid-cols-3 gap-4"
               >
                    {/* Left Section - Form Inputs */}
                    <Card className="md:col-span-3 p-4 gap-2 rounded-sm shadow-none">
                         {/* Name */}
                         <div>
                              <label className="block text-sm font-medium mb-1">Name</label>
                              <Input
                                   type="text"
                                   placeholder="Enter Role Name"
                                   {...register("name", { required: "Name is required" })}
                                   className="h-12 w-full border border-gray-300 rounded-md"
                              />
                              {errors.name && (
                                   <p className="text-red-500 text-sm mt-1">
                                        {errors.name.message}
                                   </p>
                              )}
                         </div>

                         {/* Description */}
                         <div>
                              <label className="block text-sm font-medium mb-1">Description</label>
                              <Input
                                   type="text"
                                   placeholder="Enter Description"
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

export default RoleForm;
