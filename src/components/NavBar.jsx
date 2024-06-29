import { Link } from "react-router-dom";
import githubIcon from "../assets/githubIcon.svg";

const NavBar = () => {
    return (
        <nav className="flex justify-between p-5 items-center font-nunito ">
            <Link to="/">
                <div className="text-4xl text-purple-400">Pokéventory</div>
            </Link>
            <ul className="flex gap-12 text-xl text-purple-300">
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/pokemon">Pokemon</Link>
                </li>
                <li>
                    <Link to="/items">Items</Link>
                </li>
            </ul>
            <img src={githubIcon} alt="GitHub Icon" className="w-14" />
        </nav>
    );
};

export default NavBar;
