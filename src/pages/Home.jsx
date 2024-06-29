import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import palkia from "../assets/palkia.png";

const Home = () => {
    return (
        <>
            <NavBar />
            <div className="container mx-auto sm:flex items-center justify-between py-7 ">
                <div className="container px-4 py-8">
                    <h1 className="text-4xl font-bold text-white mb-4">Welcome to Pokéventory!</h1>
                    <h2 className="text-2xl text-gray-300 mb-6">Gotta Catalog &apos;Em All!</h2>
                    <Link to="/pokemon">
                        <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">Browse Pokemon</button>
                    </Link>
                </div>
                <img src={palkia} alt="Palkia" className=" w-[450px] sm:w-[400px] md:w-[500px] lg:w-[700px] " />
            </div>
        </>
    );
};

export default Home;
