import axios from "axios";
import { useEffect, useState } from "react";
import { FaHome, FaStore, FaUsers, FaStar, FaEnvelope, FaCog } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";

const LeftSidebar = () => {
    const [allUsers, setAllUsers] = useState()

    const getAllUsers = async () => {
        try {
            const response = await axios("http://localhost:3000/api/v1/users")
            const data = await response.data

            setAllUsers(data.user)
        } catch (error) {
            console.log("all user fetching failed ===> ", error);

        }
    }

    useEffect(() => {
        getAllUsers()
    }, [])


    return (
        <div className="w-64 h-[565px] bg-white p-4 shadow-lg overflow-auto ">
            {/* Logo */}
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Scrolllink</h2>

            {/* Navigation */}
            <nav className="space-y-4">
                <a href="#" className="flex items-center gap-3 text-pink-500 font-medium">
                    <FaHome />
                    Feed
                </a>
                <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-pink-500">
                    <FaStore />
                    Explore
                </a>
                <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-pink-500">
                    <FaUsers />
                    Marketplace
                </a>
                <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-pink-500">
                    <FaStar />
                    My favorites
                </a>
                <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-pink-500">
                    <FaEnvelope />
                    Messages
                </a>
                <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-pink-500">
                    <FaCog />
                    Settings
                </a>
            </nav>

            {/* Divider */}
            <hr className="my-6 border-gray-300" />

            {/* My Contacts */}
            <h3 className="text-gray-800 font-semibold mb-4">My Contacts</h3>
            <div className="space-y-4">
                {allUsers && allUsers?.map((users) => (
                    <div key={users._id} className="flex items-center gap-3  hover:cursor-pointer hover:bg-gray-100 rounded-2xl">
                        {users.profilePic && users.profilePic ? <img
                            src={users.profilePic}
                            alt="profile"
                            className="w-12 h-12 rounded-full object-cover"
                        /> : <FaUser className="w-10 h-10 rounded-full text-gray-400 object-cover me-2 shadow-md border border-gray-500" />}
                        <div>
                            <p className="text-gray-800 font-medium">{users.username}</p>
                            <p className="text-gray-500 text-sm">{users.email}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeftSidebar;
