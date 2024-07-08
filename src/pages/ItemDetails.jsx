import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getItemByName } from "../api/itemsAPI";
import NavBar from "../components/NavBar";
import ErrorMessage from "../components/ErrorMessage";

const ItemDetails = () => {
    const { name } = useParams();
    const [item, setItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItemDetails = async () => {
            setIsLoading(true);
            try {
                const data = await getItemByName(name);
                setItem(...data);
            } catch (error) {
                console.error("Error fetching item details:", error);
                setError("Failed to fetch item details.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchItemDetails();
    }, [name]); // Fetch data whenever name changes

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    if (!item) {
        return <ErrorMessage message="Item not Found" />;
    }

    return (
        <div className="min-h-screen flex flex-col font-pokemon">
            <NavBar />
            <div className="flex flex-col p-16 gap-16">
                <Link to={`/items`} className="text-purple-300 hover:text-yellow-400 w-fit">
                    Back
                </Link>
                <div className="flex gap-12">
                    <div className={`card min-h-64 min-w-64  p-3 relative ${item.quantity === 0 ? "bg-gray-700 opacity-50" : ""}`}>
                        {item.quantity > 0 ? (
                            <></>
                        ) : (
                            <div className="absolute top-0 right-0 bg-red-500 text-white font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
                                Out of Stock
                            </div>
                        )}
                        <img src={item.spriteUrl} alt={item.name} className="w-64 h-fit" />
                    </div>
                    <div className="flex flex-col justify-between items-start">
                        <div>
                            <div className="text-2xl text-gray-300">
                                {item.name.includes("-") ? (
                                    <span>
                                        {item.name
                                            .split("-")
                                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(" ")}
                                    </span>
                                ) : (
                                    <span>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</span>
                                )}
                            </div>
                            <div className="text-gray-500 text-sm">Quantity: {item.quantity}</div>
                        </div>
                        <div className="text-gray-200 text-base">{item.effect ? item.effect : item.description}</div>
                        <button className="w-fit bg-green-500 py-3 pl-4 pr-3 rounded-full text-gray-200 text-center hover:bg-green-700">
                            Edit Item
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetails;
