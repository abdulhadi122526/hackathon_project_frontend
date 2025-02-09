
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate()
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Form Data Submitted:", formData);

        try {
            const response = await axios.post('http://localhost:3000/api/v1/login', {
                email: formData.email,
                password: formData.password,
            });
            localStorage.setItem('access_token', response.data.accessToken)
            localStorage.setItem('refresh_token', response.data.refreshToken)
            localStorage.setItem('user_profile_image', response.data.user.profilePic)
            localStorage.setItem('user_profile_username', response.data.user.username)
            localStorage.setItem('user_Id', response.data.user._id)
            console.log('Response:', response.data);
            window.dispatchEvent(new Event("authChanged")); 
            navigate("/home")
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }
        setFormData({
            email: "",
            password: "",
        });
        


    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-5">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Login
                    </button>
                </form>
                <div className="text-center mt-5">
                    <p>Creat new account <a className="text-blue-700 hover:underline" href="/signup">Creat account</a> </p>
                </div>
            </div>
        </div>
    );
};

export default Login;