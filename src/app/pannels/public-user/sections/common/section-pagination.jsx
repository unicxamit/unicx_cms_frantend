function SectionPagination({ currentPage, totalPages, onPageChange }) {
    const getPages = () => {
        const pages = [];

        if (totalPages <= 5) {
            // If total pages <= 5, show all
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push("ellipsis-left"); // left dots
            }

            // Show pages around current page
            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push("ellipsis-right"); // right dots
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const pages = getPages();

    return (
        <div className="pagination-outer">
            <div className="pagination-style2">
                <ul className="clearfix">
                    {/* Left Arrow */}
                    <li className={`prev ${currentPage === 1 ? "disabled" : ""}`}>
                        <button
                            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <span><i className="fa fa-angle-left" /></span>
                        </button>
                    </li>

                    {/* Page Numbers with ellipsis */}
                    {pages.map((page, index) => (
                        <li
                            key={index}
                            className={page === currentPage ? "active" : ""}
                        >
                            {page === "ellipsis-left" || page === "ellipsis-right" ? (
                                <span style={{ padding: "0 10px" }}>...</span>
                            ) : (
                                <button onClick={() => onPageChange(page)}>{page}</button>
                            )}
                        </li>
                    ))}

                    {/* Right Arrow */}
                    <li className={`next ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button
                            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <span><i className="fa fa-angle-right" /></span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default SectionPagination;
