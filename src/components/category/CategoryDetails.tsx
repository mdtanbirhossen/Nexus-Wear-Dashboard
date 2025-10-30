/* eslint-disable @next/next/no-img-element */
'use client'
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '../ui/card';
import Image from 'next/image';
import { useGetCategoryByIdQuery } from '@/redux/api/categoryApi/categoryApi';
import Loading from '../shared/Loading';

const CategoryDetails = () => {
     const { id } = useParams();
     const { data, isLoading, isError } = useGetCategoryByIdQuery(id);
     const router = useRouter();

     if (isLoading) return <div className='flex items-center justify-center w-full h-[calc(100vh-100px)]'><Loading /></div>;
     if (isError) return <p className="text-center py-10 text-red-500">Failed to load category details.</p>;
     if (!data) return <p className="text-center py-10">No category found</p>;

     const {
          name,
          description,
          image,
          createdAt,
          updatedAt,
          subcategory
     } = data;

     console.log(data);

     const tableData = [
          { label: "name", value: name },
          { label: "description ", value: description },
          { label: "total subcategory ", value: subcategory.length },
          { label: "createdAt", value: new Date(createdAt).toLocaleString() },
          { label: "updatedAt", value: new Date(updatedAt).toLocaleString() },
     ]

     return (
          <Card className="w-full  p-4 sm:p-6 bg-white rounded-lg shadow">
               {/* Top Section */}
               <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center mb-4 h-60 ">
                    <Image
                         src={image ?? "/profileImg.jpg"}
                         alt={name}
                         width={100}
                         height={100}
                         quality={75}
                         className="w-auto h-full  rounded  border border-gray-300 object-contain"
                    />
               </div>

               {/* Table Section */}
               <div className="overflow-x-auto  rounded ">
                    <h1 className="text-xl sm:text-2xl font-extrabold mb-2 ">Category Details:</h1>
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

export default CategoryDetails;
