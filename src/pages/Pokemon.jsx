import NavBar from "../components/NavBar";
import { getPokemonPage, addNewPokemon } from "../api/pokemonAPI";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import Pagination from "../components/Pagination";
import { PokemonContext } from "../components/PokemonContext";

const Pokemon = () => {
    const { pokemonData, setShouldRefetch } = useContext(PokemonContext);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addPokemonError, setAddPokemonError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchPage, setSearchPage] = useState(1);
    const [typeFilterPage, setTypeFilterPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [pokemonToDisplay, setPokemonToDisplay] = useState([]);
    const [typeFilter, setTypeFilter] = useState("All");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newPokemonName, setNewPokemonName] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPokemonData = async () => {
            setIsLoading(true);
            try {
                const { data, total } = await getPokemonPage(currentPage, itemsPerPage);
                const sortedData = data.sort((a, b) => a.pokedexNumber - b.pokedexNumber);
                setPokemonToDisplay(sortedData);
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

    // Handle page change
    const paginate = (pageNumber) => {
        if (searchTerm === "" && typeFilter === "All") {
            setCurrentPage(pageNumber);
        } else if (searchTerm !== "") {
            setSearchPage(pageNumber);
        } else {
            setTypeFilterPage(pageNumber);
        }

        const startIndex = (pageNumber - 1) * itemsPerPage;
        let filteredPokemon = pokemonData;

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

        let filteredPokemonBySearch = pokemonData.filter((p) => p.name.toLowerCase().includes(term.toLowerCase()));

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
        setTypeFilterPage(1); // Reset type filter page

        let filteredPokemon = pokemonData;

        if (type !== "All") {
            filteredPokemon = pokemonData.filter((p) => p.primaryType === type || p.secondaryType === type);
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
                return "bg-gray-800";
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

    const handleAddClick = () => {
        setIsAddModalOpen(true);
    };

    const handleNameChange = (event) => {
        setNewPokemonName(event.target.value);
    };

    const handleAddPokemon = async () => {
        try {
            const addedPokemon = await addNewPokemon(newPokemonName);
            navigate(`/pokemon/${addedPokemon.pokedexNumber}`);
        } catch (error) {
            setAddPokemonError(error.message);
        } finally {
            setIsAddModalOpen(false); // Close the modal after adding
            setNewPokemonName(""); // Clear the input field
            setShouldRefetch((prev) => !prev);
        }
    };

    const handleCancel = () => {
        setIsAddModalOpen(false);
        setNewPokemonName("");
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
            {addPokemonError &&
                // Show error message for 2 seconds
                setTimeout(() => {
                    setAddPokemonError(null);
                }, 3000) && <ErrorMessage message={addPokemonError} />}

            {!isLoading && !error && (
                <div className="container mx-auto px-4 py-8 grid grid-cols-[1fr_3fr] gap-8">
                    <div className="mb-2 flex justify-end gap-28 col-start-2 col-end-3">
                        <input
                            type="text"
                            placeholder="Search Pokémon..."
                            className="w-2/4 rounded-2xl border-4 border-white px-4 py-2 focus:border-purple-300 focus:outline-none"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <button
                            onClick={handleAddClick}
                            className="bg-green-700 p-3 w-fit font-pokemon text-white rounded-full hover:bg-green-800 border-green-500 border-2 hover:border-green-800"
                        >
                            + Add New
                        </button>

                        {/* Modal */}
                        {isAddModalOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="bg-white rounded-lg p-8 w-96">
                                    <h2 className="text-2xl font-semibold mb-4">Add New Pokémon</h2>
                                    <div className="mb-4">
                                        <label htmlFor="pokemonName" className="block text-gray-700 text-sm font-bold mb-2">
                                            Pokémon Name:
                                        </label>
                                        <input
                                            type="text"
                                            id="pokemonName"
                                            value={newPokemonName}
                                            onChange={handleNameChange}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            placeholder="e.g. Pikachu"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button onClick={handleCancel} className="mr-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg">
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddPokemon}
                                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                                        >
                                            Add Pokémon
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="card mb-4 mt-11 h-fit min-w-full px-2 py-4 md:mb-0 md:w-1/4 col-start-1 col-end-2">
                        <h2 className="mb-2 text-center font-pokemon text-lg font-semibold text-white">Filter by Type</h2>
                        <ul className="flex flex-col gap-4">
                            <button onClick={() => filteredByType("All")}>
                                <li className={`pokemonTypeFilter ${getTypeBackgroundColor("All")} `}>All</li>
                            </button>
                            <div className="flex justify-center gap-4">
                                <div className="flex flex-col gap-2">
                                    <button onClick={() => filteredByType("grass")}>
                                        <li className={`pokemonTypeFilter ${getTypeBackgroundColor("grass")} `}>Grass</li>
                                    </button>
                                    <button onClick={() => filteredByType("fire")}>
                                        <li className={`pokemonTypeFilter ${getTypeBackgroundColor("fire")} `}>Fire</li>
                                    </button>
                                    <button onClick={() => filteredByType("water")}>
                                        <li className={`pokemonTypeFilter ${getTypeBackgroundColor("water")} `}>Water</li>
                                    </button>
                                    <button onClick={() => filteredByType("bug")}>
                                        <li className={`pokemonTypeFilter ${getTypeBackgroundColor("bug")} `}>Bug</li>
                                    </button>
                                    <button onClick={() => filteredByType("normal")}>
                                        <li className={`pokemonTypeFilter ${getTypeBackgroundColor("normal")} `}>Normal</li>
                                    </button>
                                    <button onClick={() => filteredByType("poison")}>
                                        <li className={`pokemonTypeFilter ${getTypeBackgroundColor("poison")} `}>Poison</li>
                                    </button>
                                    <button onClick={() => filteredByType("electric")}>
                                        <li className={`pokemonTypeFilter ${getTypeBackgroundColor("electric")} `}>Electric</li>
                                    </button>
                                    <button onClick={() => filteredByType("ground")}>
                                        <li className={`pokemonTypeFilter ${getTypeBackgroundColor("ground")} `}>Ground</li>
                                    </button>
                                    <button onClick={() => filteredByType("flying")}>
                                        <li className={`pokemonTypeFilter ${getTypeBackgroundColor("flying")} `}>Flying</li>
                                    </button>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button onClick={() => filteredByType("fighting")}>
                                        <li className={`pokemonTypeFilter ${getTypeBackgroundColor("fighting")} `}>Fighting</li>
                                    </button>
                                    <button onClick={() => filteredByType("psychic")}>
                                        <li className={`pokemonTypeFilter ${getTypeBackgroundColor("psychic")} `}>Psychic</li>
                                    </button>
                                    <button onClick={() => filteredByType("rock")}>
                                        <li className={`pokemonTypeFilter ${getTypeBackgroundColor("rock")} `}>Rock</li>
                                    </button>
                                    <button onClick={() => filteredByType("ghost")}>
                                        <li className={`pokemonTypeFilter ${getTypeBackgroundColor("ghost")} `}>Ghost</li>
                                    </button>
                                    <button onClick={() => filteredByType("ice")}>
                                        <li className={`pokemonTypeFilter ${getTypeBackgroundColor("ice")} `}>Ice</li>
                                    </button>
                                    <button onClick={() => filteredByType("dragon")}>
                                        <li className={`pokemonTypeFilter ${getTypeBackgroundColor("dragon")} `}>Dragon</li>
                                    </button>
                                    <button onClick={() => filteredByType("dark")}>
                                        <li className={`pokemonTypeFilter ${getTypeBackgroundColor("dark")} `}>Dark</li>
                                    </button>
                                    <button onClick={() => filteredByType("steel")}>
                                        <li className={`pokemonTypeFilter ${getTypeBackgroundColor("steel")} `}>Steel</li>
                                    </button>
                                    <button onClick={() => filteredByType("fairy")}>
                                        <li className={`pokemonTypeFilter ${getTypeBackgroundColor("fairy")} `}>Fairy</li>
                                    </button>
                                </div>
                            </div>
                        </ul>
                    </div>
                    <div className="md:w-3/4 min-w-full col-start-2 col-end-3 flex flex-col justify-self-center">
                        {/* Pagination controls */}
                        {pokemonToDisplay.length > 0 && (
                            <div className="flex justify-end">
                                <Pagination
                                    totalPages={totalPages}
                                    currentPage={searchTerm === "" ? (typeFilter === "All" ? currentPage : typeFilterPage) : searchPage}
                                    paginate={paginate}
                                    searchTerm={searchTerm}
                                    searchPage={searchPage}
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
                            {pokemonToDisplay.map((p) => (
                                <Link
                                    to={`/pokemon/${p.pokedexNumber}`}
                                    key={p._id}
                                    className="card cursor-pointer p-2 transition hover:scale-105"
                                >
                                    <img src={p.spriteUrl} alt={p.name.charAt(0).toUpperCase() + p.name.slice(1)} className="w-full" />
                                    <div className="mb-2 text-center font-pokemon text-[15px] font-medium text-white sm:text-[14px] md:text-[13px] lg:text-[14px] xl:text-[16px]">
                                        {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                                    </div>
                                    <div className="flex items-center justify-center gap-2 truncate font-pokemon text-[10px] text-white sm:gap-1 sm:text-[7px] md:gap-2 md:text-[8px] lg:gap-3 lg:text-[8px] xl:text-[10px]">
                                        <div className={`rounded-full px-2 py-1 ${getTypeBackgroundColor(p.primaryType)}`}>
                                            {p.primaryType.charAt(0).toUpperCase() + p.primaryType.slice(1)}{" "}
                                        </div>
                                        {p.secondaryType ? (
                                            <div className={`rounded-full px-2 py-1 ${getTypeBackgroundColor(p.secondaryType)}`}>
                                                {p.secondaryType.charAt(0).toUpperCase() + p.secondaryType.slice(1)}
                                            </div>
                                        ) : null}
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination controls */}
                        {(pokemonToDisplay.length > 0 && (
                            <Pagination
                                totalPages={totalPages}
                                currentPage={searchTerm === "" ? (typeFilter === "All" ? currentPage : typeFilterPage) : searchPage}
                                paginate={paginate}
                                searchTerm={searchTerm}
                                searchPage={searchPage}
                            />
                        )) || <div className="text-white">No Pokémon found</div>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pokemon;
