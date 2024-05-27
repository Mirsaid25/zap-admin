"use client"
import React, { useState } from 'react'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "@/components/ui/pagination"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const PaginationCom = ({ sessions, searchParams }: any) => {
    const { push } = useRouter()
    // const [currentPage, setCurrentPage] = useState(1)
    let limit = 20
    const totalPage = sessions / limit

    const handlePageChange = (pageNumber: number) => {
        // setCurrentPage(pageNumber)
        push(`?page=${pageNumber}`)
    };

    const renderPages = () => {
        const pages = [];

        for (let i = 1; i <= Math.ceil(totalPage); i++) {
            pages.push(
                <li
                    key={i}
                    className={`${i === +searchParams.page ? "bg-[#fff] text-black" : "bg-transparent hover:text-black hover:bg-[#fff]"} h-8 w-8 text-center pt-1 cursor-pointer border border-white duration-75 ease-in rounded-sm`}
                    onClick={() => handlePageChange(i)}
                // onClick={() => push(`?page=${i}`)}
                >
                    {i}
                </li>
            );
        }

        return pages;
    };

    return (
        <ul className='m-auto max-w-2xl w-full flex gap-2 items-center justify-center mt-5'>
            {
                renderPages()
            }
        </ul>
    )
}

export default PaginationCom
