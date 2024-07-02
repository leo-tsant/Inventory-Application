import NavBar from "../components/NavBar";
import { getAllPokemon, getPokemonPage } from "../api/pokemonAPI";
import { useState, useEffect } from "react";
import ErrorMessage from "../components/ErrorMessage";
import left from "../assets/left.svg";
import right from "../assets/right.svg";

const Pokemon = () => {
    const [pokemon, setPokemon] = useState([]);
    const [allPokemon, setAllPokemon] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchPage, setSearchPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchPokemonData = async () => {
            setIsLoading(true);
            try {
                const { data, total } = await getPokemonPage(currentPage, itemsPerPage);
                setPokemon(data);
                setTotalPages(Math.ceil(total / itemsPerPage));
            } catch (error) {
                console.error("Error fetching Pokémon:", error);
                setError("Failed to fetch Pokémon data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPokemonData();
    }, [currentPage, itemsPerPage]);

    useEffect(() => {
        const fetchAllPokemon = async () => {
            try {
                const data = await getAllPokemon();
                setAllPokemon(data);
            } catch (error) {
                console.error("Error fetching Pokémon:", error);
                setError("Failed to fetch Pokémon data.");
            }
        };
        fetchAllPokemon();
    }, []);

    // Handle page change
    const paginate = (pageNumber) => {
        if (searchTerm) {
            setSearchPage(pageNumber);
        } else {
            setCurrentPage(pageNumber);
        }
    };

    // Filter Pokémon based on search term
    const filteredPokemon = allPokemon.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredTotalPages = Math.ceil(filteredPokemon.length / itemsPerPage);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setSearchPage(1); // Reset search page to 1 when search term changes
    };

    const paginationRange = (totalPages, currentPage) => {
        const range = [];
        const maxPagesToShow = 3; // Maximum number of pages to show in pagination

        if (totalPages <= maxPagesToShow) {
            // If total pages are less than or equal to max pages to show, show all pages
            for (let i = 1; i <= totalPages; i++) {
                range.push(i);
            }
        } else {
            const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);

            let startPage = Math.max(currentPage - halfMaxPagesToShow, 1);
            let endPage = Math.min(currentPage + halfMaxPagesToShow, totalPages);

            // Adjust start and end if they exceed the boundaries
            if (startPage === 1) {
                endPage = maxPagesToShow;
            }
            if (endPage === totalPages) {
                startPage = totalPages - maxPagesToShow + 1;
            }

            // Always show page 1
            range.push(1);

            // Add ellipsis after the first page if the startPage is greater than 2
            if (startPage > 2) {
                range.push(". . .");
            }

            // Add pages from start to end
            for (let i = startPage; i <= endPage; i++) {
                if (i !== 1 && i !== totalPages) {
                    // Avoid adding first and last page again
                    range.push(i);
                }
            }

            // Add ellipsis before the last page if the endPage is less than totalPages - 1
            if (endPage < totalPages - 1) {
                range.push(". . .");
            }

            // Always show the last page
            range.push(totalPages);
        }

        return range;
    };

    // Helper function to get background color based on type
    const getTypeBackgroundColor = (type) => {
        switch (type.toLowerCase()) {
            case "grass":
                return "bg-green-500";
            case "fire":
                return "bg-red-500";
            case "water":
                return "bg-blue-500";
            case "bug":
                return "bg-green-700";
            case "normal":
                return "bg-gray-500";
            case "poison":
                return "bg-purple-500";
            case "electric":
                return "bg-yellow-500";
            case "ground":
                return "bg-yellow-700";
            case "fighting":
                return "bg-red-700";
            case "psychic":
                return "bg-purple-700";
            case "rock":
                return "bg-yellow-900";
            case "ghost":
                return "bg-indigo-500";
            case "ice":
                return "bg-blue-700";
            case "dragon":
                return "bg-blue-900";
            case "dark":
                return "bg-gray-900";
            case "steel":
                return "bg-gray-400";
            case "flying":
                return "bg-blue-300";
            case "fairy":
                return "bg-pink-500";
            default:
                return "bg-gray-500"; // Default color
        }
    };

    const currentPokemon = searchTerm === "" ? pokemon : filteredPokemon.slice((searchPage - 1) * itemsPerPage, searchPage * itemsPerPage);

    const currentTotalPages = searchTerm === "" ? totalPages : filteredTotalPages;

    return (
        <div>
            <NavBar />
            {isLoading && (
                <div className="flex justify-center items-center h-screen">
                    <div className="spinner"></div>
                </div>
            )}
            {error && (
                <div className="flex justify-center items-center h-screen">
                    <ErrorMessage message={error} />
                </div>
            )}
            {!isLoading && !error && (
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-16">
                        <div className="md:w-1/4 mb-4 md:mb-0 card">
                            <h2 className="text-lg font-semibold text-white mb-2">Filter by Type</h2>
                            <ul>
                                <li className="cursor-pointer text-purple-300 hover:text-yellow-400">All</li>
                                <li className="cursor-pointer text-purple-300 hover:text-yellow-400">Grass</li>
                                <li className="cursor-pointer text-purple-300 hover:text-yellow-400">Fire</li>
                            </ul>
                        </div>

                        <div className="md:w-3/4">
                            <div className="mb-4 flex justify-center">
                                <input
                                    type="text"
                                    placeholder="Search Pokémon..."
                                    className="w-2/4 px-4 py-2 rounded-2xl border-4 border-white focus:outline-none focus:border-purple-300"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>

                            {/* Pagination controls */}
                            {currentPokemon.length > 0 && (
                                <div className="flex justify-end mt-4 items-start">
                                    {/* Previous button */}
                                    <button
                                        onClick={() => paginate((searchTerm === "" ? currentPage : searchPage) - 1)}
                                        className={` h-full flex  ${
                                            (searchTerm === "" ? currentPage : searchPage) === 1 ? " cursor-not-allowed" : ""
                                        } rounded`}
                                        disabled={(searchTerm === "" ? currentPage : searchPage) === 1}
                                    >
                                        <img src={left} alt="left arrow" className="w-7 " />
                                    </button>

                                    {/* Page buttons */}
                                    {paginationRange(currentTotalPages, searchTerm === "" ? currentPage : searchPage).map(
                                        (pageNumber, index) =>
                                            pageNumber === ". . ." ? (
                                                <div
                                                    key={`ellipsis-${index}`}
                                                    className=" flex items-center py-[2px] h-full  text-gray-200"
                                                >
                                                    {pageNumber}
                                                </div>
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
                                        className={`h-full ${
                                            (searchTerm === "" ? currentPage : searchPage) === currentTotalPages ? "cursor-not-allowed" : ""
                                        } rounded`}
                                        disabled={(searchTerm === "" ? currentPage : searchPage) === currentTotalPages}
                                    >
                                        <img src={right} alt="right arrow" className="w-7" />
                                    </button>
                                </div>
                            )}

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {currentPokemon.map((p) => (
                                    <div key={p._id} className="card transition hover:scale-105 cursor-pointer">
                                        <img src={p.spriteUrl} alt={p.name.charAt(0).toUpperCase() + p.name.slice(1)} className="w-full" />
                                        <div className="text-[15px] sm:text-[14px] md:text-[13px] lg:text-[14px] xl:text-[16px] font-medium text-white text-center font-pokemon mb-2">
                                            {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                                        </div>
                                        <div className="flex justify-center items-center  gap-2 sm:gap-1 md:gap-2 lg:gap-3 truncate text-[10px] sm:text-[7px] md:text-[8px] lg:text-[8px] xl:text-[10px]  text-white  font-pokemon">
                                            <div className={`rounded-full px-2 py-1 ${getTypeBackgroundColor(p.primaryType)}`}>
                                                {p.primaryType.charAt(0).toUpperCase() + p.primaryType.slice(1)}{" "}
                                            </div>
                                            {p.secondaryType ? (
                                                <div className={`rounded-full px-2 py-1 ${getTypeBackgroundColor(p.secondaryType)}`}>
                                                    {p.secondaryType.charAt(0).toUpperCase() + p.secondaryType.slice(1)}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination controls */}
                            {(currentPokemon.length > 0 && (
                                <div className="flex justify-center mt-4 items-start">
                                    {/* Previous button */}
                                    <button
                                        onClick={() => paginate((searchTerm === "" ? currentPage : searchPage) - 1)}
                                        className={` h-full flex  ${
                                            (searchTerm === "" ? currentPage : searchPage) === 1 ? " cursor-not-allowed" : ""
                                        } rounded`}
                                        disabled={(searchTerm === "" ? currentPage : searchPage) === 1}
                                    >
                                        <img src={left} alt="left arrow" className="w-7 " />
                                    </button>

                                    {/* Page buttons */}
                                    {paginationRange(currentTotalPages, searchTerm === "" ? currentPage : searchPage).map(
                                        (pageNumber, index) =>
                                            pageNumber === ". . ." ? (
                                                <span key={`ellipsis-${index}`} className="px-1  py-[2px] h-full  text-gray-200 text-white">
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
                                        className={`h-full ${
                                            (searchTerm === "" ? currentPage : searchPage) === currentTotalPages ? "cursor-not-allowed" : ""
                                        } rounded`}
                                        disabled={(searchTerm === "" ? currentPage : searchPage) === currentTotalPages}
                                    >
                                        <img src={right} alt="right arrow" className="w-7" />
                                    </button>
                                </div>
                            )) || <div className="text-white">No Pokémon found</div>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pokemon;
