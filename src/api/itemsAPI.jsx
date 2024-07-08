import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getItemPage = async (page, limit) => {
    try {
        const response = await axios.get(`${API_URL}/all-items/page`, {
            params: {
                page,
                limit,
            },
        });
        const { data, total, allItems } = response.data;
        return { data, total, allItems };
    } catch (error) {
        throw new Error("Failed to fetch item data.");
    }
};

export const getItemByName = async (name) => {
    try {
        const response = await axios.get(`${API_URL}/all-items/${name}`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch item data.");
    }
};
