import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPokemonByPokedexNumber, deletePokemon } from "../api/pokemonAPI";
import NavBar from "../components/NavBar";
import ErrorMessage from "../components/ErrorMessage";
import { PokemonContext } from "../components/PokemonContext";

const PokemonDetails = () => {
    const { pokedexNumbers, setShouldRefetch } = useContext(PokemonContext);

    const { pokedexNumber } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            setIsLoading(true);
            try {
                const data = await getPokemonByPokedexNumber(pokedexNumber);

                setPokemon(data);
            } catch (error) {
                console.error("Error fetching Pokémon details:", error);
                setError("Failed to fetch Pokémon details.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPokemonDetails();
    }, [pokedexNumber]); // Fetch data whenever pokedexNumber changes

    const speakerIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="60" height="60" viewBox="0 0 75 75" className="text-purple-500">
            <path
                d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z"
                style={{
                    stroke: "#d8b4fe",
                    strokeWidth: 4,
                    strokeLinejoin: "round",
                    fill: "currentColor", // Use currentColor to enable Tailwind fill color
                }}
            />
            <path
                d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6"
                style={{
                    fill: "none",
                    stroke: "currentColor", // Use currentColor to enable Tailwind stroke color
                    strokeWidth: 5,
                    strokeLinecap: "round",
                }}
            />
        </svg>
    );

    const playCry = () => {
        if (pokemon?.cryUrl) {
            const audio = new Audio(pokemon.cryUrl);
            audio.volume = 0.15;
            audio.play().catch((error) => {
                console.error("Error playing Pokémon cry:", error);
            });
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    if (!pokemon) {
        return <ErrorMessage message="Pokemon not Found" />;
    }

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

    // Find the index of the current Pokemon's pokedexNumber in pokedexNumbers array
    const currentIndex = pokedexNumbers.indexOf(pokemon.pokedexNumber);

    // Determine previous and next Pokemon
    const previousPokemon = currentIndex > 0 ? pokedexNumbers[currentIndex - 1] : null;
    const nextPokemon = currentIndex < pokedexNumbers.length - 1 ? pokedexNumbers[currentIndex + 1] : null;

    const handleDeleteClick = () => {
        // Check if the Pokemon can be deleted
        if (!pokemon.canBeDeleted) {
            setPopupMessage("Sorry, you can only delete Pokemon with pokedex number greater than 151.");
            setTimeout(() => {
                setPopupMessage("");
            }, 3000);
            return;
        }

        setShowDeleteModal(true); // Show the confirmation modal
    };

    const handleConfirmDelete = async () => {
        try {
            await deletePokemon(pokemon.pokedexNumber);
            setShouldRefetch((prev) => !prev); // Update context to refetch data
            navigate("/pokemon"); // Redirect to the Pokemon list page
        } catch (error) {
            console.error("Error deleting Pokémon:", error);
            setError("Failed to delete Pokémon.");
        } finally {
            setShowDeleteModal(false); // Hide the modal
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    return (
        <div className="min-h-screen flex flex-col font-pokemon">
            <NavBar />
            <div className="container flex flex-col mx-auto px-4 py-8 justify-center items-center flex-grow gap-24">
                <div className="flex justify-between w-full text-purple-300 ">
                    <Link to={`/pokemon`} className="hover:text-yellow-400 ">
                        Back
                    </Link>
                    <div className="flex gap-10">
                        {previousPokemon && (
                            <Link to={`/pokemon/${previousPokemon}`} className="hover:text-yellow-400">
                                Previous
                            </Link>
                        )}
                        {nextPokemon && (
                            <Link to={`/pokemon/${nextPokemon}`} className="hover:text-yellow-400">
                                Next
                            </Link>
                        )}
                    </div>
                </div>
                <div className="flex justify-start items-start flex-grow w-full gap-16">
                    <div className="card h-fit p-3">
                        <img src={pokemon.spriteUrl} alt={pokemon.name} className="w-80 h-fit" />
                        <h2 className="text-2xl font-semibold text-white text-center font-pokemon mb-2">
                            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                        </h2>
                        <div className="flex justify-center items-center gap-2 truncate text-white font-pokemon">
                            <div className={`rounded-full px-2 py-1 ${getTypeBackgroundColor(pokemon.primaryType)}`}>
                                {pokemon.primaryType.charAt(0).toUpperCase() + pokemon.primaryType.slice(1)}
                            </div>
                            {pokemon.secondaryType && (
                                <div className={`rounded-full px-2 py-1 ${getTypeBackgroundColor(pokemon.secondaryType)}`}>
                                    {pokemon.secondaryType.charAt(0).toUpperCase() + pokemon.secondaryType.slice(1)}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="container flex flex-col gap-12 mt-10 w-fit">
                        <div className="text-yellow-400 text-2xl">Pokedex Number: {pokemon.pokedexNumber}</div>
                        <div>
                            <div className="mb-2 text-gray-100 text-lg">Base Stats</div>
                            <div className="flex flex-col gap-2 w-2/3">
                                <div className="bg-red-400 text-white px-2 rounded flex justify-between">
                                    <span>HP:</span> <span>{pokemon.baseStats.hp}</span>
                                </div>
                                <div className="bg-orange-400 text-white px-2 rounded flex justify-between">
                                    <span>Attack:</span> <span>{pokemon.baseStats.attack}</span>
                                </div>
                                <div className="bg-yellow-400 text-white px-2 rounded flex justify-between">
                                    <span>Defense:</span> <span>{pokemon.baseStats.defense}</span>
                                </div>
                                <div className="bg-pink-400 text-white px-2 rounded flex justify-between">
                                    <span>Sp.Attack:</span> <span>{pokemon.baseStats.specialAttack}</span>
                                </div>
                                <div className="bg-purple-400 text-white px-2 rounded flex justify-between">
                                    <span>Sp.Defense:</span> <span>{pokemon.baseStats.specialDefense}</span>
                                </div>
                                <div className="bg-blue-400 text-white px-2 rounded flex justify-between">
                                    <span>Speed:</span> <span>{pokemon.baseStats.speed}</span>
                                </div>
                            </div>
                        </div>
                        <div className="justify-between flex w-2/3 items-center">
                            <button onClick={playCry}>
                                <div className="flex items-center w-fit rounded">{speakerIcon}</div>
                            </button>
                            <div className="relative">
                                <button
                                    onClick={handleDeleteClick} // Call handleDeleteClick to open modal
                                    className="w-fit p-2 bg-red-500 text-gray-200 rounded-xl hover:bg-red-600"
                                >
                                    Delete
                                </button>
                                {popupMessage && (
                                    <div className="absolute top-full mt-2 p-2 bg-gray-200 text-gray-700 rounded-xl font-nunito text-xs w-[240px]">
                                        {popupMessage}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-8">
                        <p className="text-lg mb-4">Are you sure you want to delete this Pokémon?</p>
                        <div className="flex justify-end">
                            <button onClick={handleCancelDelete} className="mr-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg">
                                Cancel
                            </button>
                            <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PokemonDetails;
