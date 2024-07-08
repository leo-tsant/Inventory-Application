import NavBar from "../components/NavBar";
import ErrorMessage from "../components/ErrorMessage";
import Pagination from "../components/Pagination";
import { getItemPage } from "../api/itemsAPI";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Items = () => {
    const [itemsToDisplay, setItemsToDisplay] = useState([]);
    const [allItems, setAllItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchPage, setSearchPage] = useState(1);
    const [categoryPage, setCategoryPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");

    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            try {
                const { data, total, allItems } = await getItemPage(currentPage, itemsPerPage);
                setItemsToDisplay(data);
                setAllItems(allItems);
                setTotalPages(Math.ceil(total / itemsPerPage));
            } catch (error) {
                console.error("Error fetching item data:", error);
                setError("Failed to fetch item data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchItems();
    }, [currentPage, itemsPerPage]);

    const paginate = (pageNumber) => {
        if (searchTerm === "" && categoryFilter === "All") {
            setCurrentPage(pageNumber);
        } else if (searchTerm !== "") {
            setSearchPage(pageNumber);
        } else {
            setCategoryPage(pageNumber);
        }

        const startIndex = (pageNumber - 1) * itemsPerPage;
        let filteredItems = allItems;

        if (searchTerm) {
            filteredItems = filteredItems.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        if (categoryFilter !== "All") {
            filteredItems = filteredItems.filter((p) => p.category === categoryFilter);
        }

        const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);
        setItemsToDisplay(paginatedItems);
    };

    const filterByCategory = (category) => {
        setCategoryFilter(category);
        setCurrentPage(1); // Reset current page
        setSearchPage(1); // Reset search page
        setCategoryPage(1); // Reset category page

        if (category === "All") {
            setItemsToDisplay(allItems.slice(0, itemsPerPage));
            setTotalPages(Math.ceil(allItems.length / itemsPerPage));
            return;
        }

        const filteredItemsByCategory = allItems.filter((item) => item.category === category);
        setItemsToDisplay(filteredItemsByCategory.slice(0, itemsPerPage));
        setTotalPages(Math.ceil(filteredItemsByCategory.length / itemsPerPage));
    };

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setSearchPage(1); // Reset search page to 1 when search term changes

        const filteredItemsBySearch = allItems.filter((item) => item.name.toLowerCase().includes(term.toLowerCase()));
        setTotalPages(Math.ceil(filteredItemsBySearch.length / itemsPerPage));
        setItemsToDisplay(filteredItemsBySearch.slice(0, itemsPerPage));
    };

    return (
        <div>
            <NavBar />
            {isLoading && (
                <div className="flex h-screen items-center justify-center">
                    <div className="spinner"></div>
                </div>
            )}
            {error && (
                <div className="flex h-screen items-center justify-center">
                    <ErrorMessage message={error} />
                </div>
            )}
            {!isLoading && !error && (
                <div className="container mx-auto px-4 py-8 grid grid-cols-[1fr_3fr] gap-8">
                    {/* Cell 1,2: Search input field */}
                    <div className="mb-2 flex justify-center col-start-2 col-end-3">
                        <input
                            type="text"
                            placeholder="Search Item..."
                            className="w-2/4 rounded-2xl border-4 border-white px-4 py-2 focus:border-purple-300 focus:outline-none"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>

                    {/* Cell 2,1: Filter section */}
                    <div className="flex justify-evenly col-start-1 col-end-2">
                        <div className="flex flex-col  items-center card mb-4 mt-11 h-fit px-2 py-4 md:mb-0 md:w-full ">
                            <h2 className="mb-2 text-center font-pokemon text-lg font-semibold text-white">Filter by Category</h2>
                            <ul className="flex flex-col gap-4 w-2/3 ">
                                <button onClick={() => filterByCategory("All")}>
                                    <li className="pokemonTypeFilter bg-gray-500 ">All</li>
                                </button>
                                <button onClick={() => filterByCategory("pokeball")}>
                                    <li className="pokemonTypeFilter bg-purple-700">Poké Balls</li>
                                </button>
                                <button onClick={() => filterByCategory("battleItem")}>
                                    <li className="pokemonTypeFilter bg-red-700">Battle Items</li>
                                </button>
                                <button onClick={() => filterByCategory("healingItem")}>
                                    <li className="pokemonTypeFilter bg-blue-500">Healing Items</li>
                                </button>
                                <button onClick={() => filterByCategory("heldItem")}>
                                    <li className="pokemonTypeFilter bg-indigo-500">Held Items</li>
                                </button>
                                <button onClick={() => filterByCategory("berry")}>
                                    <li className="pokemonTypeFilter bg-green-500">Berries</li>
                                </button>

                                <div className="flex justify-center gap-4"></div>
                            </ul>
                        </div>
                    </div>

                    <div>
                        {/* Pagination controls */}
                        {itemsToDisplay.length > 0 && (
                            <div className="flex justify-end">
                                <Pagination
                                    totalPages={totalPages}
                                    currentPage={searchTerm === "" ? (categoryFilter === "All" ? currentPage : categoryPage) : searchPage}
                                    paginate={paginate}
                                    searchTerm={searchTerm}
                                    searchPage={searchPage}
                                />
                            </div>
                        )}
                        {/* Cell 2,2: Items grid */}
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 col-start-2 col-end-3 ">
                            {itemsToDisplay.map((item) => (
                                <div
                                    key={item._id}
                                    className={`card relative cursor-pointer p-2 pb-4 transition hover:scale-105 ${
                                        item.quantity === 0 ? "bg-gray-700 opacity-50" : ""
                                    }`}
                                >
                                    {item.quantity > 0 ? (
                                        <></>
                                    ) : (
                                        <div className="absolute top-0 right-0 bg-red-500 text-white font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
                                            Out of Stock
                                        </div>
                                    )}
                                    <img
                                        src={item.spriteUrl}
                                        alt={item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                                        className="w-32 mx-auto"
                                    />
                                    <div className="text-center font-pokemon text-[13px] font-medium text-white sm:text-[12px] md:text-[11px] lg:text-[13px] xl:text-[14px]">
                                        {item.name.includes("-") ? (
                                            <span>
                                                {item.name
                                                    .split("-")
                                                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                                    .join(" ")}
                                            </span>
                                        ) : (
                                            <span>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Pagination controls */}
                        {(itemsToDisplay.length > 0 && (
                            <div className="flex justify-center">
                                <Pagination
                                    totalPages={totalPages}
                                    currentPage={searchTerm === "" ? (categoryFilter === "All" ? currentPage : categoryPage) : searchPage}
                                    paginate={paginate}
                                    searchTerm={searchTerm}
                                    searchPage={searchPage}
                                />
                            </div>
                        )) || <div className="text-white">No Pokémon found</div>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Items;
