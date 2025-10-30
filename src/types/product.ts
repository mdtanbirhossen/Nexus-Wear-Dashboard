import { Category, Subcategory } from "./categoryAndSubcategory"
import { Color } from "./color"
import { Size } from "./size"

export type Product = {
     id: string,
     deletedAt: string,
     createdAt:string,
     updatedAt:string,
     name: string,
     images: string[],
     file: FileList,
     productCode: string,
     description:string,
     price: string,
     availability: string,
     category: Category,
     categoryId: number,
     subCategory: Subcategory,
     subcategoryId: number,
     colorIds:string[],
     sizeIds:string[],
     colors: Color[],
     sizes: Size[],
     viewCount: string,
     lastViewedAt: string,
     orderCount: string,
     lastOrderedAt: string
}



export type ProductResponse = {
     data: Product[];
     limit: number;
     page: number;
     total: number;
}