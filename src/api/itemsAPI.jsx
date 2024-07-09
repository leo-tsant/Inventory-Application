import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllItems = async () => {
    try {
        const response = await axios.get(`${API_URL}/items`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch item data.");
    }
};

export const getItemPage = async (page, limit) => {
    try {
        const response = await axios.get(`${API_URL}/items/page`, {
            params: {
                page,
                limit,
            },
        });
        const { data, total } = response.data;
        return { data, total };
    } catch (error) {
        throw new Error("Failed to fetch item data.");
    }
};

export const getItemByName = async (name) => {
    try {
        const response = await axios.get(`${API_URL}/items/${name}`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch item data.");
    }
};

export const updateItem = async (name, quantity) => {
    try {
        const response = await axios.patch(`${API_URL}/items/${name}`, { quantity });
        return response.data;
    } catch (error) {
        console.error("Error updating item:", error.response ? error.response.data : error.message);
        throw error;
    }
};
