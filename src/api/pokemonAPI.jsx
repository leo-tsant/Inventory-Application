import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const getAllPokemon = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/pokemon`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch Pokémon data.");
    }
};

export const getPokemonPage = async (page, limit) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/pokemon/page`, {
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
        const response = await axios.get(`${API_BASE_URL}/pokemon/${pokedexNumber}`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch Pokémon details.");
    }
};
