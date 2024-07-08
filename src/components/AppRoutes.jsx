import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Pokemon from "../pages/Pokemon";
import Items from "../pages/Items";
import PokemonDetails from "../pages/PokemonDetails";
import ItemDetails from "../pages/ItemDetails";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pokemon" element={<Pokemon />} />
            <Route path="/pokemon/:pokedexNumber" element={<PokemonDetails />} />
            <Route path="/items/:name" element={<ItemDetails />} />
            <Route path="/items" element={<Items />} />
        </Routes>
    );
};

export default AppRoutes;
