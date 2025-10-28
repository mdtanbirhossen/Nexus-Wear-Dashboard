export type Size = {
     id: string;
     name: string;
     description: string;
     image: string | null;
     createdAt: string;
     updatedAt: string;
     deletedAt: string;
}



export type SizeResponse = {
     data: Size[];
     limit: number;
     page: number;
     total: number;
}