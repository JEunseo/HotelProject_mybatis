import React from "react";
import {Pagination} from "react-bootstrap";

const PaginationComponent = ({page, totalPages, setPage}) => {
    const moveToPre = () => {
        if (page > 1) setPage(page - 1)
    }

    const moveToNext = () => {
        if (page < totalPages) setPage(page + 1)
    }

    const moveToFirst = () => {
        setPage(1)
    }

    const moveToLast = () => {
        setPage(totalPages)
    }

    const pageItem = () => {
        let items = [];
        let startPage = Math.max(1, page - 1);
        let endPage = Math.min(totalPages, page + 1);

        if (startPage === 1) {
            endPage = Math.min(3, totalPages)
        }

        if (endPage === totalPages) {
            startPage = Math.max(1, endPage - 2)
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
                    {i}
                </Pagination.Item>
            );
        }
        return items;
    };

    return (
        <Pagination>
            <Pagination.First onClick={moveToFirst} disabled={page === 1}/>
            <Pagination.Prev onClick={moveToPre} disabled={page === 1}/>
            {pageItem()}
            <Pagination.Next onClick={moveToNext} disabled={page === totalPages}/>
            <Pagination.Last onClick={moveToLast} disabled={page === totalPages}/>
        </Pagination>
    )
}

export default PaginationComponent