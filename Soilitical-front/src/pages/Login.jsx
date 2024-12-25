import { useState } from "react";
import Form from "../components/Form";
import { useLoading } from "../context/LoadingContext";

const Login = () => {
	const [error, setError] = useState("");
	const { showLoader } = useLoading();

	const handleLogin = async (data) => {
		showLoader();
	};

	return (
		<div
			className="flex items-center justify-center w-full h-screen px-4 sm:px-0 bg-cover bg-center"
			style={{
				backgroundImage:
					"url('/images/background.jpeg'), linear-gradient(to right, rgba(84, 170, 240, 0.4), rgba(36, 139, 255, 0.4), rgba(0, 59, 107, 0.8))",
				backgroundBlendMode: "overlay",
				backgroundSize: "cover",
				backgroundPosition: "center"
			}}
		>
			<div className="w-full max-w-md">
				<Form
					method="login"
					route="/api/token/"
					showConfirmPassword={false}
					error={error}
					setError={setError}
					onSubmit={handleLogin}
					showLoader={showLoader}
				/>
			</div>
		</div>
	);
};

export default Login;
