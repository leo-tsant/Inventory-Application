import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllPokemon = async () => {
    try {
        const response = await axios.get(`${API_URL}/pokemon`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch Pokémon data.");
    }
};

export const getPokemonPage = async (page, limit) => {
    try {
        const response = await axios.get(`${API_URL}/pokemon/page`, {
            params: {
                page,
                limit,
            },
        });
        const { data, total } = response.data;
        return { data, total };
    } catch (error) {
        throw new Error("Failed to fetch Pokémon data.");
    }
};

export const getPokemonByPokedexNumber = async (pokedexNumber) => {
    try {
        const response = await axios.get(`${API_URL}/pokemon/${pokedexNumber}`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch Pokémon details.");
    }
};
