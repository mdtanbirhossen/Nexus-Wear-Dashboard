'use client'
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '../ui/card';
import Image from 'next/image';
import { useGetProductByIdQuery } from '@/redux/api/productsApi/productsApi';

const ProductDetails = () => {
     const { id } = useParams();
     const { data, isLoading, isError } = useGetProductByIdQuery(id as string);
     console.log(isError);
     const router = useRouter();

     if (isLoading) return <p className="text-center py-10">Loading...</p>;
     if (isError) return <p className="text-center py-10 text-red-500">Failed to load admin details.</p>;
     if (!data) return <p className="text-center py-10">No admin found</p>;

     const {
          name,
          images,
          productCode,
          description,
          price,
          availability,
          category,
          subCategory,
          colors,
          sizes,
          viewCount,
          orderCount,
          createdAt,
          updatedAt,
     } = data;

     const tableData = [
          { label: "name", value: name },
          { label: "productCode", value: productCode },
          { label: "description", value: description },
          { label: "price", value: price },
          { label: "availability", value: availability },
          { label: "category", value: category },
          { label: "subCategory", value: subCategory },
          { label: "colors", value: colors },
          { label: "sizes", value: sizes },
          { label: "viewCount", value: viewCount },
          { label: "orderCount", value: orderCount },
          { label: "Created At", value: new Date(createdAt).toLocaleString() },
          { label: "Updated At", value: new Date(updatedAt).toLocaleString() },
     ]

     return (
          <Card className="w-full  p-4 sm:p-6 bg-white rounded-lg shadow">
               {/* Top Section */}
               <div className="flex flex-wrap gap-4 sm:gap-6 items-center mb-4">
                    {
                         images?.map((image, idx) => (
                              <Image
                                   key={idx}
                                   src={image ?? "/profileImg.jpg"}
                                   alt={name}
                                   width={100}
                                   height={100}
                                   quality={75}
                                   className="w-32 h-32 sm:w-42 sm:h-42 rounded-full border border-gray-300 object-cover"
                              />
                         ))
                    }
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

export default ProductDetails;
