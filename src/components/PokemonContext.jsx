import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types"; // Add this line to import PropTypes
import { getAllPokemon } from "../api/pokemonAPI"; // Your API function

export const PokemonContext = createContext();

const PokemonProvider = ({ children }) => {
    // Add prop validation for 'children'
    PokemonProvider.propTypes = {
        children: PropTypes.node.isRequired,
    };
    const [pokemonData, setPokemonData] = useState([]);
    const [pokedexNumbers, setPokedexNumbers] = useState([]);
    const [shouldRefetch, setShouldRefetch] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllPokemon();
                const sortedData = data.sort((a, b) => a.pokedexNumber - b.pokedexNumber);
                setPokemonData(sortedData);

                // Extract pokedexNumbers from the data
                const numbers = sortedData.map((pokemon) => pokemon.pokedexNumber);
                setPokedexNumbers(numbers);
            } catch (error) {
                console.error("Error fetching Pokémon:", error);
            }
        };
        fetchData();
    }, [shouldRefetch]);

    const value = {
        pokemonData,
        pokedexNumbers,
        setShouldRefetch,
    };

    return <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>;
};

export default PokemonProvider;
