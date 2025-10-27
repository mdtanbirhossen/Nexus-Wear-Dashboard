"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

// Redux
import { useDeleteAdminMutation, useGetAllAdminsQuery } from "@/redux/api/adminApi/adminApi"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
     Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
     Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
     PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import {
     AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
     AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog"

// Icons
import { Pencil, Trash, Eye } from "lucide-react"
// Types
import { Admin } from "@/types/admin"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"


export default function AdminTable() {
     // State
     const [currentPage, setCurrentPage] = useState(1)
     const [itemsPerPage, setItemsPerPage] = useState(10)
     const [searchTerm, setSearchTerm] = useState("")
     const [statusFilter, setStatusFilter] = useState("all")
     const [debouncedSearch, setDebouncedSearch] = useState(searchTerm)
     console.log(searchTerm, debouncedSearch);


     React.useEffect(() => {
          const timeout = setTimeout(() => {
               setDebouncedSearch(searchTerm)
          }, 500);
          return () => clearTimeout(timeout)
     }, [searchTerm])



     const router = useRouter()

     // API calls
     const { data, isLoading } = useGetAllAdminsQuery({
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearch,
          status: statusFilter === "all" ? undefined : statusFilter,
     })

     const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation()



     // Data
     const admins: Admin[] = data?.data || []
     const total = data?.total || 0
     const totalPages = Math.ceil(total / itemsPerPage)
     // console.log(admins);



     // Filtering
     // const filteredAdmins = admins.filter((admin) => {
     //      const matchesSearch =
     //           admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     //           admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     //           admin.phone.includes(searchTerm) ||
     //           admin.role.name.toLowerCase().includes(searchTerm.toLowerCase())

     //      const matchesStatus =
     //           statusFilter === "all" ? true : admin.status === statusFilter

     //      return matchesSearch && matchesStatus
     // })




     // Handlers
     const handleDelete = async (adminId: string) => {
          if (adminId) {
               try {
                    await deleteAdmin(adminId)
               } catch (error) {
                    console.error("Delete failed", error)
               }
          }
     }




     return (
          <div className="w-full pb-6">
               {/* Search + Filter + Add */}
               <div className="flex flex-wrap gap-3  items-center justify-between mb-4 w-auto">
                    <Input
                         placeholder="Search admins..."
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className="w-full md:max-w-sm"
                    />

                    <div className="flex gap-3 items-center">
                         {/* Rows per page */}
                         <Select value={String(itemsPerPage)} onValueChange={(val) => {
                              setItemsPerPage(Number(val))
                              setCurrentPage(1)
                         }}>
                              <SelectTrigger className="">
                                   <SelectValue placeholder="Rows" />
                              </SelectTrigger>
                              <SelectContent>
                                   <SelectItem value="5">5</SelectItem>
                                   <SelectItem value="10">10</SelectItem>
                                   <SelectItem value="20">20</SelectItem>
                              </SelectContent>
                         </Select>

                         <Select value={statusFilter} onValueChange={setStatusFilter}>
                              <SelectTrigger className="">
                                   <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                   <SelectItem value="all">All</SelectItem>
                                   <SelectItem value="active">Active</SelectItem>
                                   <SelectItem value="inactive">Inactive</SelectItem>
                                   <SelectItem value="pending">Pending</SelectItem>
                                   <SelectItem value="deleted">Deleted</SelectItem>
                              </SelectContent>
                         </Select>

                         <Button onClick={() => router.push("/admin/create")}>
                              Add Admin
                         </Button>
                    </div>
               </div>

               {/* Table */}
               <div className="overflow-hidden rounded-md border text-center">
                    <Table>
                         <TableHeader>
                              <TableRow>
                                   <TableHead className="font-extrabold text-center">*</TableHead>
                                   <TableHead className="font-extrabold ">Image</TableHead>
                                   <TableHead className="font-extrabold text-center">Name</TableHead>
                                   <TableHead className="font-extrabold text-center">Email</TableHead>
                                   <TableHead className="font-extrabold text-center">Phone</TableHead>
                                   <TableHead className="font-extrabold text-center">Role</TableHead>
                                   <TableHead className="font-extrabold text-center">Status</TableHead>
                                   <TableHead className="font-extrabold text-center">Actions</TableHead>
                              </TableRow>
                         </TableHeader>

                         <TableBody>
                              {isLoading ? (
                                   <TableRow>
                                        <TableCell colSpan={7} className="text-center py-6">
                                             Loading...
                                        </TableCell>
                                   </TableRow>
                              ) : admins.length ? (
                                   admins.map((admin, idx) => (
                                        <TableRow key={admin.id}>
                                             <TableCell>
                                                  {(currentPage - 1) * itemsPerPage + idx + 1}
                                             </TableCell>

                                             <TableCell>
                                                  <Image
                                                       src={admin.image ?? "/profileImg.jpg"}
                                                       alt="images"
                                                       width={50}
                                                       height={50}
                                                       quality={75}
                                                       className="h-12 w-12 object-contain"
                                                       draggable={false}
                                                  />
                                             </TableCell>

                                             <TableCell>{admin.name}</TableCell>
                                             <TableCell>{admin.email}</TableCell>
                                             <TableCell>{admin.phone}</TableCell>
                                             <TableCell>{admin.role.name}</TableCell>

                                             <TableCell>
                                                  <span
                                                       className={`px-2 py-1 text-xs font-semibold rounded-full ${admin.status === "active"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                            }`}
                                                  >
                                                       {admin.status}
                                                  </span>
                                             </TableCell>

                                             {/* Actions */}
                                             <TableCell>
                                                  {/* Edit */}
                                                  <Button
                                                       onClick={() => router.push(`/admin/update/${admin.id}`)}
                                                       variant="ghost"
                                                       className="h-8 w-8 p-0"
                                                  >
                                                       <Pencil />
                                                  </Button>

                                                  {/* Details */}
                                                  <Button
                                                       onClick={() => router.push(`/admin/details/${admin.id}`)}
                                                       variant="ghost"
                                                       className="h-8 w-8 p-0"
                                                  >
                                                       <Eye />
                                                  </Button>


                                                  <AlertDialog>
                                                       <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" disabled={isDeleting}>
                                                                 <Trash />
                                                            </Button>
                                                       </AlertDialogTrigger>

                                                       <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                 <AlertDialogTitle>
                                                                      Are you absolutely sure?
                                                                 </AlertDialogTitle>
                                                                 <AlertDialogDescription>
                                                                      This action cannot be undone. This will permanently
                                                                      delete your account and remove your data from our
                                                                      servers.
                                                                 </AlertDialogDescription>
                                                            </AlertDialogHeader>

                                                            <AlertDialogFooter>
                                                                 <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                 <AlertDialogAction
                                                                      disabled={isDeleting}
                                                                      onClick={() => handleDelete(admin?.id)}
                                                                      className="bg-red-600 font-extrabold"
                                                                 >
                                                                      Continue
                                                                 </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                       </AlertDialogContent>
                                                  </AlertDialog>
                                             </TableCell>
                                        </TableRow>
                                   ))
                              ) : (
                                   <TableRow>
                                        <TableCell colSpan={7} className="text-center py-6">
                                             No results found.
                                        </TableCell>
                                   </TableRow>
                              )}
                         </TableBody>
                    </Table>
               </div>

               {/* Pagination */}
               <div className="flex items-center justify-center xl:justify-end mt-4">

                    {/* Page navigation */}
                    <div className="mt-4 flex justify-center">
                         <Pagination>
                              <PaginationContent>
                                   <PaginationItem>
                                        <PaginationPrevious
                                             href="#"
                                             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                             className={
                                                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                                             }
                                        />
                                   </PaginationItem>

                                   {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                        (page) => (
                                             <PaginationItem key={page}>
                                                  <PaginationLink
                                                       href="#"
                                                       isActive={currentPage === page}
                                                       onClick={() => setCurrentPage(page)}
                                                  >
                                                       {page}
                                                  </PaginationLink>
                                             </PaginationItem>
                                        )
                                   )}

                                   {totalPages > 5 && <PaginationEllipsis />}

                                   <PaginationItem>
                                        <PaginationNext
                                             href="#"
                                             onClick={() =>
                                                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                                             }
                                             className={
                                                  currentPage === totalPages
                                                       ? "pointer-events-none opacity-50"
                                                       : ""
                                             }
                                        />
                                   </PaginationItem>
                              </PaginationContent>
                         </Pagination>
                    </div>
               </div>
          </div>
     )
}