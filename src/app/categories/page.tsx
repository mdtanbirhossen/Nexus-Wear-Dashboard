import { getAllCategories } from '@/actions/categories';
import CategoryTable from '@/components/category/CategoryTable';
import React from 'react';

const page = async () => {
       const data = await getAllCategories({
              page: 1,
              limit: 10,
       });
       console.log(data)


       return <>
              {/* <CategoryTable data={data} isLoading={false} /> */}
       </>


};

export default page;