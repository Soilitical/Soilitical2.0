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
		<div className="flex items-center justify-center w-full h-screen px-4 sm:px-0 bg-cover bg-center">
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
