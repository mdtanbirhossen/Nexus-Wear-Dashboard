/* eslint-disable @next/next/no-img-element */
'use client'
import { useGetAdminByIdQuery } from '@/redux/api/adminApi/adminApi';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '../ui/card';
import Image from 'next/image';

const AdminDetails = () => {
     const { id } = useParams();
     const { data, isLoading, isError } = useGetAdminByIdQuery(id);
     console.log(isError);
     const router = useRouter();

     if (isLoading) return <p className="text-center py-10">Loading...</p>;
     if (isError) return <p className="text-center py-10 text-red-500">Failed to load admin details.</p>;
     if (!data) return <p className="text-center py-10">No admin found</p>;

     const {
          name,
          email,
          phone,
          nationalId,
          addressLine,
          image,
          status,
          role,
          createdAt,
          updatedAt,
     } = data;

     const tableData = [
          { label: "Phone", value: phone },
          { label: "National ID", value: nationalId },
          { label: "Address", value: addressLine },
          { label: "Role Name", value: role?.name },
          { label: "Role Description", value: role?.description },
          { label: "Created At", value: new Date(createdAt).toLocaleString() },
          { label: "Updated At", value: new Date(updatedAt).toLocaleString() },
     ]

     return (
          <Card className="w-full  p-4 sm:p-6 bg-white rounded-lg shadow">
               {/* Top Section */}
               <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center mb-4">
                    <Image
                         src={image ?? "/profileImg.jpg"}
                         alt={name}
                         width={100}
                         height={100}
                         quality={75}
                         className="w-32 h-32 sm:w-42 sm:h-42 rounded-full border border-gray-300 object-cover"
                    />
                    <div className="text-center sm:text-left">
                         <div className='flex items-center justify-center sm:justify-start gap-2 mb-1'>
                              <h2 className="text-xl sm:text-2xl font-semibold">{name}</h2>
                              <span className='text-sm border rounded-2xl px-2 py-1'>{status}</span>
                         </div>
                         <p className="text-gray-600 font-medium text-sm sm:text-base">{email}</p>
                    </div>
               </div>

               {/* Table Section */}
               <div className="overflow-x-auto  rounded ">
                    <h1 className="text-xl sm:text-2xl font-extrabold mb-2 ">Admin Details:</h1>
                    <table className="w-full  border-collapse border border-gray-300 text-sm sm:text-base">
                         <tbody>
                              {tableData.map((item, idx) => (
                                   <tr key={idx} className="border">
                                        <td className="font-semibold p-2 border-r whitespace-nowrap">{item.label}</td>
                                        <td className="p-2">{item.value}</td>
                                   </tr>
                              ))}
                         </tbody>
                    </table>

                    <div className="mt-4  ">
                         <Button onClick={() => router.back()}>Go Back</Button>
                    </div>
               </div>
          </Card>
     );
};

export default AdminDetails;
