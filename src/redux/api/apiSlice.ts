import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { logout } from "../features/authSlice";


const baseQuery = fetchBaseQuery({
     baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
     prepareHeaders: (headers, { getState }) => {
          const token = (getState() as RootState).auth?.token;
          if (token) {
               headers.set("Authorization", `Bearer ${token}`);
          }
          return headers;
     },
});

const baseQueryWithAuth: typeof baseQuery = async (args, api, extraOptions) => {
     const result = await baseQuery(args, api, extraOptions);
     console.log(result);
     // if (result.error && result.error.status === 401) {
     //      api.dispatch(logout()); 
     // }
     return result;
};

export const apiSlice = createApi({
     reducerPath: "api",
     baseQuery: baseQueryWithAuth,
     tagTypes: ["Admin", "Category", "SubCategory", "Role", "Color", "Size","Product"],
     endpoints: () => ({}),
});
