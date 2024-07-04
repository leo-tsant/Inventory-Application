import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const getAllItems = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/all-items`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch item data.");
    }
};

export const getItemPage = async (page, limit) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/items/page`, {
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
