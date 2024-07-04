import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import palkia from "../assets/palkia.png";

const Home = () => {
  return (
    <>
      <NavBar />
      <div className="container mx-auto items-center justify-between py-7 sm:flex">
        <div className="container px-4 py-8">
          <h1 className="mb-4 text-4xl font-bold text-white">
            Welcome to Pokéventory!
          </h1>
          <h2 className="mb-6 text-2xl text-gray-300">
            Gotta Catalog &apos;Em All!
          </h2>
          <Link to="/pokemon">
            <button className="rounded bg-yellow-500 px-4 py-2 font-bold text-white hover:bg-yellow-700">
              Browse Pokemon
            </button>
          </Link>
        </div>
        <img
          src={palkia}
          alt="Palkia"
          className="w-[450px] sm:w-[400px] md:w-[500px] lg:w-[600px]"
        />
      </div>
    </>
  );
};

export default Home;
