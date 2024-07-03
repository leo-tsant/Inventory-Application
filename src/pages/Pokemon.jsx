import NavBar from "../components/NavBar";
import { getAllPokemon, getPokemonPage } from "../api/pokemonAPI";
import { useState, useEffect } from "react";
import ErrorMessage from "../components/ErrorMessage";
import Pagination from "../components/Pagination";

const Pokemon = () => {
    const [allPokemon, setAllPokemon] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchPage, setSearchPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [pokemonToDisplay, setPokemonToDisplay] = useState([]);
    const [typeFilter, setTypeFilter] = useState("All");

    useEffect(() => {
        const fetchPokemonData = async () => {
            setIsLoading(true);
            try {
                const { data, total } = await getPokemonPage(currentPage, itemsPerPage);
                setPokemonToDisplay(data);
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
        if (searchTerm === "" && typeFilter === "All") {
            setCurrentPage(pageNumber);
        } else {
            setSearchPage(pageNumber);
        }

        const startIndex = (pageNumber - 1) * itemsPerPage;
        let filteredPokemon = allPokemon;

        if (searchTerm) {
            filteredPokemon = filteredPokemon.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        if (typeFilter !== "All") {
            filteredPokemon = filteredPokemon.filter((p) => p.primaryType === typeFilter || p.secondaryType === typeFilter);
        }

        const paginatedPokemon = filteredPokemon.slice(startIndex, startIndex + itemsPerPage);
        setPokemonToDisplay(paginatedPokemon);
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setSearchPage(1); // Reset search page to 1 when search term changes

        let filteredPokemonBySearch = allPokemon.filter((p) => p.name.toLowerCase().includes(term.toLowerCase()));

        if (typeFilter !== "All") {
            filteredPokemonBySearch = filteredPokemonBySearch.filter((p) => p.primaryType === typeFilter || p.secondaryType === typeFilter);
        }

        setTotalPages(Math.ceil(filteredPokemonBySearch.length / itemsPerPage));
        setPokemonToDisplay(filteredPokemonBySearch.slice(0, itemsPerPage));
    };

    const filteredByType = (type) => {
        setTypeFilter(type);
        setCurrentPage(1); // Reset current page
        setSearchPage(1); // Reset search page

        let filteredPokemon = allPokemon;

        if (type !== "All") {
            filteredPokemon = allPokemon.filter((p) => p.primaryType === type || p.secondaryType === type);
        }

        if (searchTerm) {
            filteredPokemon = filteredPokemon.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        setTotalPages(Math.ceil(filteredPokemon.length / itemsPerPage));
        setPokemonToDisplay(filteredPokemon.slice(0, itemsPerPage));
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
                                <li className="cursor-pointer text-purple-300 hover:text-yellow-400">
                                    <button onClick={() => filteredByType("All")}>All</button>
                                </li>
                                <li className="cursor-pointer text-purple-300 hover:text-yellow-400">
                                    <button onClick={() => filteredByType("grass")}>Grass</button>
                                </li>
                                <li className="cursor-pointer text-purple-300 hover:text-yellow-400">
                                    <button onClick={() => filteredByType("fire")}>Fire</button>
                                </li>
                                <li className="cursor-pointer text-purple-300 hover:text-yellow-400">
                                    <button onClick={() => filteredByType("water")}>Water</button>
                                </li>
                                <li className="cursor-pointer text-purple-300 hover:text-yellow-400">
                                    <button onClick={() => filteredByType("bug")}>Bug</button>
                                </li>
                                <li className="cursor-pointer text-purple-300 hover:text-yellow-400">
                                    <button onClick={() => filteredByType("normal")}>Normal</button>
                                </li>
                                <li className="cursor-pointer text-purple-300 hover:text-yellow-400">
                                    <button onClick={() => filteredByType("poison")}>Poison</button>
                                </li>
                                <li className="cursor-pointer text-purple-300 hover:text-yellow-400">
                                    <button onClick={() => filteredByType("electric")}>Electric</button>
                                </li>
                                <li className="cursor-pointer text-purple-300 hover:text-yellow-400">
                                    <button onClick={() => filteredByType("ground")}>Ground</button>
                                </li>
                                <li className="cursor-pointer text-purple-300 hover:text-yellow-400">
                                    <button onClick={() => filteredByType("fighting")}>Fighting</button>
                                </li>
                                <li className="cursor-pointer text-purple-300 hover:text-yellow-400">
                                    <button onClick={() => filteredByType("psychic")}>Psychic</button>
                                </li>
                                <li className="cursor-pointer text-purple-300 hover:text-yellow-400">
                                    <button onClick={() => filteredByType("rock")}>Rock</button>
                                </li>
                                <li className="cursor-pointer text-purple-300 hover:text-yellow-400">
                                    <button onClick={() => filteredByType("ghost")}>Ghost</button>
                                </li>
                                <li className="cursor-pointer text-purple-300 hover:text-yellow-400">
                                    <button onClick={() => filteredByType("ice")}>Ice</button>
                                </li>
                                <li className="cursor-pointer text-purple-300 hover:text-yellow-400">
                                    <button onClick={() => filteredByType("dragon")}>Dragon</button>
                                </li>
                                <li className="cursor-pointer text-purple-300 hover:text-yellow-400">
                                    <button onClick={() => filteredByType("dark")}>Dark</button>
                                </li>
                                <li className="cursor-pointer text-purple-300 hover:text-yellow-400">
                                    <button onClick={() => filteredByType("steel")}>Steel</button>
                                </li>
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
                            {pokemonToDisplay.length > 0 && (
                                <div className="flex justify-end">
                                    <Pagination
                                        totalPages={totalPages}
                                        currentPage={searchTerm === "" ? currentPage : searchPage}
                                        paginate={paginate}
                                        searchTerm={searchTerm}
                                        searchPage={searchPage}
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {pokemonToDisplay.map((p) => (
                                    <div key={p._id} className="card transition hover:scale-105 cursor-pointer">
                                        <img src={p.spriteUrl} alt={p.name.charAt(0).toUpperCase() + p.name.slice(1)} className="w-full" />
                                        <div className="text-[15px] sm:text-[14px] md:text-[13px] lg:text-[14px] xl:text-[16px] font-medium text-white text-center font-pokemon mb-2">
                                            {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                                        </div>
                                        <div className="flex justify-center items-center  gap-2 sm:gap-1 md:gap-2 lg:gap-3 truncate text-[10px] sm:text-[7px] md:text-[8px] lg:text-[8px] xl:text-[10px]  text-white  font-pokemon">
                                            <div className={`rounded-full  px-2 py-1 ${getTypeBackgroundColor(p.primaryType)}`}>
                                                {p.primaryType.charAt(0).toUpperCase() + p.primaryType.slice(1)}{" "}
                                            </div>
                                            {p.secondaryType ? (
                                                <div className={`rounded-full  px-2 py-1 ${getTypeBackgroundColor(p.secondaryType)}`}>
                                                    {p.secondaryType.charAt(0).toUpperCase() + p.secondaryType.slice(1)}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination controls */}
                            {(pokemonToDisplay.length > 0 && (
                                <Pagination
                                    totalPages={totalPages}
                                    currentPage={searchTerm === "" ? currentPage : searchPage}
                                    paginate={paginate}
                                    searchTerm={searchTerm}
                                    searchPage={searchPage}
                                />
                            )) || <div className="text-white">No Pokémon found</div>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pokemon;
