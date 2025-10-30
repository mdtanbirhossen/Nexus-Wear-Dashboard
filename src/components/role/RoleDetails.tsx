'use client'
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '../ui/card';
import { useGetRoleByIdQuery } from '@/redux/api/roleApi/roleApi';
import Loading from '../shared/Loading';

const RoleDetails = () => {
     const { id } = useParams();
     const { data, isLoading, isError } = useGetRoleByIdQuery(id);
     const router = useRouter();

     if (isLoading) return <div className='flex items-center justify-center w-full h-[calc(100vh-100px)]'><Loading /></div>;
     if (isError) return <p className="text-center py-10 text-red-500">Failed to load role details.</p>;
     if (!data) return <p className="text-center py-10">No roles found</p>;

     const {
          name,
          description,
          createdAt,
          updatedAt,
     } = data;

     const tableData = [
          { label: "Role Name", value: name },
          { label: "Description", value: description },
          { label: "Created At", value: new Date(createdAt).toLocaleString() },
          { label: "Updated At", value: new Date(updatedAt).toLocaleString() },
     ]

     return (
          <Card className="w-full  p-4 sm:p-6 bg-white rounded-lg shadow">
               <div className="overflow-x-auto  rounded ">
                    <h1 className="text-xl sm:text-2xl font-extrabold mb-2 ">Role Details:</h1>
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

export default RoleDetails;