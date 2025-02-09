import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../components/middaleware";

const Signup = () => {
    const [profilePic , setProfilePic] = useState()
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const navigate = useNavigate()

    const Signup = async (e) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);

        console.log("Form Data Submitted:", formData);

        try {
            const response = await axiosInstance.post('/signup', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                profilePic,
                
            });
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }
        setFormData({
            username: "",
            email: "",
            password: "",
        });
        navigate("/")



    };

    // image uploading

    let myWidget = cloudinary.createUploadWidget({
        cloudName: 'dkiexi2xx',
        uploadPreset: 'expertizo-hackathon'


    }, (error, result) => {
        if (!error && result && result.event === "success") {
            console.log('Done! Here is the image info: ', result.info.url);
            setProfilePic(result.info.url)
        }
    })

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-5 pt-20">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>
                <form onSubmit={Signup} >
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}

                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
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

                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <span className="btn" onClick={()=> myWidget.open()}>Upload your photo</span>
                    </div>

                    <button type="submit" className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"> Sign up </button>
                </form>
                <div className="text-center mt-5">
                    <p>Already have account <a className="text-blue-700 hover:underline" href="/">Login</a> </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;