import { useState } from "react";
import Form from "../components/Form";
import { useLoading } from "../context/LoadingContext";

const SignUp = () => {
	const [error, setError] = useState("");
	const { showLoader } = useLoading();

	const handleSignup = async (data) => {
		showLoader();
		// Add your signup logic here
	};

	return (
		<div className="flex items-center justify-center w-full h-screen px-4 sm:px-0 bg-cover bg-center">
			{" "}
			<div className="w-full max-w-md">
				<Form
					method="signup"
					route="/api/user/register/"
					showConfirmPassword={true}
					error={error}
					setError={setError}
					onSubmit={handleSignup}
					showLoader={showLoader}
				/>
			</div>
		</div>
	);
};

export default SignUp;
