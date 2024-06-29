import { Link, useLocation } from "react-router-dom";
import githubIcon from "../assets/githubIcon.svg";

const NavBar = () => {
    const location = useLocation();

    return (
        <nav className="flex justify-between p-5 items-center font-nunito bg-black bg-opacity-25 backdrop-blur-md  ">
            <Link to="/">
                <div className="text-4xl text-purple-400">Pokéventory</div>
            </Link>
            <ul className="flex gap-12 text-xl">
                <li className={location.pathname === "/" ? "text-purple-600" : "text-purple-300"}>
                    <Link to="/">Home</Link>
                </li>
                <li className={location.pathname.startsWith("/pokemon") ? "text-purple-600" : "text-purple-300"}>
                    <Link to="/pokemon">Pokemon</Link>
                </li>
                <li className={location.pathname.startsWith("/items") ? "text-purple-600" : "text-purple-300"}>
                    <Link to="/items">Items</Link>
                </li>
            </ul>
            <a href="https://github.com/leo-tsant/pokeventory" target="_blank">
                <img
                    src={githubIcon}
                    alt="GitHub Icon"
                    className="w-10 transform  duration-200  cursor-pointer hover:rotate-[360deg] hover:scale-[1.3]  rounded-full  "
                />
            </a>
        </nav>
    );
};

export default NavBar;
