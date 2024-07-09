import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Pokemon from "../pages/Pokemon";
import Items from "../pages/Items";
import PokemonDetails from "../pages/PokemonDetails";
import ItemDetails from "../pages/ItemDetails";
import PokemonProvider from "./PokemonContext";

const AppRoutes = () => {
    return (
        <PokemonProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pokemon" element={<Pokemon />} />
                <Route path="/pokemon/:pokedexNumber" element={<PokemonDetails />} />
                <Route path="/items/:name" element={<ItemDetails />} />
                <Route path="/items" element={<Items />} />
            </Routes>
        </PokemonProvider>
    );
};

export default AppRoutes;
