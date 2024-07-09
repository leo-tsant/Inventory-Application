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

export const addNewPokemon = async (pokemonName) => {
    try {
        const response = await axios.post(`${API_URL}/pokemon/add/${pokemonName}`);
        return response.data; // Assuming backend returns the newly created Pokémon instance
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const { response } = error;
            if (response && response.status === 404) {
                throw new Error("Pokémon not found");
            } else if (response && response.status === 400 && response.data.error === "Pokémon already exists in the database") {
                throw new Error("Pokémon already exists in the database");
            } else {
                throw new Error("Failed to add Pokémon");
            }
        } else {
            throw error;
        }
    }
};
