import NavBar from "../components/NavBar";
import ErrorMessage from "../components/ErrorMessage";
import Pagination from "../components/Pagination";
import { getAllItems } from "../api/itemsAPI";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Items = () => {
    const [allItems, setAllItems] = useState([]);
    const [battleItems, setBattleItems] = useState([]);
    const [berries, setBerries] = useState([]);
    const [healingItems, setHealingItems] = useState([]);
    const [heldItems, setHeldItems] = useState([]);
    const [pokeballs, setPokeballs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchPage, setSearchPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            try {
                const data = await getAllItems();
                const allItems = [...data.healingItems, ...data.battleItems, ...data.berries, ...data.heldItems, ...data.pokeballs];
                setAllItems(allItems);
                setHealingItems(data.healingItems);
                setBattleItems(data.battleItems);
                setBerries(data.berries);
                setHeldItems(data.heldItems);
                setPokeballs(data.pokeballs);
            } catch (error) {
                console.error("Error fetching item data:", error);
                setError("Failed to fetch item data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchItems();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setSearchPage(1);
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
                        <div className="card mb-4 h-fit px-2 py-4 md:mb-0 md:w-full">
                            <h2 className="mb-2 text-center font-pokemon text-lg font-semibold text-white">Filter by Type</h2>
                            <ul className="flex flex-col gap-4">
                                <button>
                                    <li className="pokemonTypeFilter">All</li>
                                </button>
                                <div className="flex justify-center gap-4"></div>
                            </ul>
                        </div>
                    </div>

                    {/* Cell 2,2: Items grid */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 col-start-2 col-end-3">
                        {allItems.map((item) => (
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
                </div>
            )}
        </div>
    );
};

export default Items;
