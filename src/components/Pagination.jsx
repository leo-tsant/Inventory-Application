import left from "../assets/left.svg";
import right from "../assets/right.svg";

// eslint-disable-next-line react/prop-types
const Pagination = ({ totalPages, currentPage, paginate, searchTerm, searchPage }) => {
    const paginationRange = (totalPages, currentPage) => {
        const range = [];
        const maxVisiblePages = 5;
        const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                range.push(i);
            }
        } else {
            if (currentPage <= halfMaxVisiblePages + 1) {
                for (let i = 1; i <= maxVisiblePages - 1; i++) {
                    range.push(i);
                }
                range.push(". . .");
                range.push(totalPages);
            } else if (currentPage >= totalPages - halfMaxVisiblePages) {
                range.push(1);
                range.push(". . .");
                for (let i = totalPages - (maxVisiblePages - 2); i <= totalPages; i++) {
                    range.push(i);
                }
            } else {
                range.push(1);
                range.push(". . .");
                for (let i = currentPage - halfMaxVisiblePages + 1; i <= currentPage + halfMaxVisiblePages - 1; i++) {
                    range.push(i);
                }
                range.push(". . .");
                range.push(totalPages);
            }
        }

        return range;
    };

    return (
        <div className="flex justify-center mt-4 items-start">
            {/* Previous button */}
            <button
                onClick={() => paginate((searchTerm === "" ? currentPage : searchPage) - 1)}
                className={` h-full flex  ${(searchTerm === "" ? currentPage : searchPage) === 1 ? " cursor-not-allowed" : ""} rounded`}
                disabled={(searchTerm === "" ? currentPage : searchPage) === 1}
            >
                <img src={left} alt="left arrow" className="w-7 " />
            </button>

            {/* Page buttons */}
            {paginationRange(totalPages, searchTerm === "" ? currentPage : searchPage).map((pageNumber, index) =>
                pageNumber === ". . ." ? (
                    <span key={`ellipsis-${index}`} className="px-1  py-[2px] h-full  text-gray-200 ">
                        {pageNumber}
                    </span>
                ) : (
                    <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`text-xl ${
                            (searchTerm === "" ? currentPage : searchPage) === pageNumber
                                ? " text-purple-200 px-2"
                                : " text-purple-700 px-2"
                        } rounded`}
                    >
                        {pageNumber}
                    </button>
                )
            )}

            {/* Next button */}
            <button
                onClick={() => paginate((searchTerm === "" ? currentPage : searchPage) + 1)}
                className={`h-full ${(searchTerm === "" ? currentPage : searchPage) === totalPages ? "cursor-not-allowed" : ""} rounded`}
                disabled={(searchTerm === "" ? currentPage : searchPage) === totalPages}
            >
                <img src={right} alt="right arrow" className="w-7" />
            </button>
        </div>
    );
};

export default Pagination;
