import { Link, useNavigate } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";

const CustomLink = ({ to, children }) => {
	const { showLoader } = useLoading();
	const navigate = useNavigate();

	const handleClick = () => {
		showLoader();
		navigate(to);
	};

	return (
		<span
			onClick={handleClick}
			className="text-blue-500 hover:underline cursor-pointer"
		>
			{children}
		</span>
	);
};

export default CustomLink;
