/* eslint-disable react-hooks/exhaustive-deps */
import NavBar from "../components/NavBar";
import { getAllPokemon, getPokemonPage } from "../api/pokemonAPI";
import { useState, useEffect } from "react";
import ErrorMessage from "../components/ErrorMessage"; // Import the error message component

const Pokemon = () => {
    const [pokemon, setPokemon] = useState([]);
    const [allPokemon, setAllPokemon] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
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
    }, [currentPage]);

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
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Filter Pokémon based on search term
    const filteredPokemon = allPokemon.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
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
                        <div className="md:w-1/4 mb-4 md:mb-0 card ">
                            <h2 className="text-lg font-semibold text-white mb-2">Filter by Type</h2>
                            <ul>
                                <li className="cursor-pointer text-purple-300 hover:text-yellow-400">All</li>
                                <li className="cursor-pointer text-purple-300 hover:text-yellow-400">Grass</li>
                                <li className="cursor-pointer text-purple-300 hover:text-yellow-400">Fire</li>
                            </ul>
                        </div>

                        <div className="md:w-3/4 ">
                            <div className="mb-4 flex justify-end">
                                <input
                                    type="text"
                                    placeholder="Search Pokémon..."
                                    className="w-2/4 px-4 py-2 rounded-2xl border-4 border-white focus:outline-none focus:border-purple-300 "
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {searchTerm === ""
                                    ? pokemon.map((p) => (
                                          <div key={p._id} className="card transition hover:scale-105 cursor-pointer">
                                              <img
                                                  src={p.spriteUrl}
                                                  alt={p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                                                  className="w-full"
                                              />
                                              <h3 className=" truncate text-sm font-medium text-white text-center font-pokemon">
                                                  {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                                              </h3>
                                              <p className="text-[10px] text-gray-400 text-center font-pokemon">
                                                  {p.primaryType.charAt(0).toUpperCase() + p.primaryType.slice(1)}{" "}
                                                  {p.secondaryType
                                                      ? p.secondaryType.charAt(0).toUpperCase() + p.secondaryType.slice(1)
                                                      : null}
                                              </p>
                                          </div>
                                      ))
                                    : filteredPokemon.map((p) => (
                                          <div key={p._id} className="card transition hover:scale-105 cursor-pointer">
                                              <img
                                                  src={p.spriteUrl}
                                                  alt={p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                                                  className="w-full"
                                              />
                                              <h3 className="text-sm font-medium text-white text-center font-pokemon">
                                                  {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                                              </h3>
                                              <p className="text-[10px] text-gray-400 text-center font-pokemon">
                                                  {p.primaryType.charAt(0).toUpperCase() + p.primaryType.slice(1)}{" "}
                                                  {p.secondaryType
                                                      ? p.secondaryType.charAt(0).toUpperCase() + p.secondaryType.slice(1)
                                                      : null}
                                              </p>
                                          </div>
                                      ))}
                            </div>

                            {/* Pagination controls */}
                            <div className="flex justify-center mt-4">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => paginate(i + 1)}
                                        className={`px-4 py-2 mx-1 ${
                                            currentPage === i + 1 ? "bg-purple-600 text-white" : "bg-purple-300 text-black"
                                        } rounded`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pokemon;
