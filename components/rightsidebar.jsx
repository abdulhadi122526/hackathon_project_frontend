import axios from "axios";
import { useEffect, useState } from "react";
import { FaUserPlus, FaUserCheck } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import axiosInstance from "./middaleware";

const RightSidebar = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [reqSent, setReqSent] = useState({}); // Store request status for each user

    const getAllUsers = async () => {
        try {
            const response = await axios("http://localhost:3000/api/v1/users");
            const data = response.data;
            console.log("User friends data ===>", data.user);
            setAllUsers(data.user);
        } catch (error) {
            console.log("All user fetching failed ===>", error);
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    const reqSenderId = localStorage.getItem("user_Id");

    // Send friend request
    const sendRequest = async (id) => {
        try {
            const res = await axiosInstance.post("/send", {
                senderId: reqSenderId,
                receiverId: id,
            });

            const data = res.data;
            console.log("Friend req data ===>", data);

            // Update only this user's request status
            setReqSent((prev) => ({ ...prev, [id]: true }));
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="w-72 bg-white p-4 shadow-lg rounded-lg">
            {/* Recent Chats */}
            <h2 className="font-semibold text-gray-700 mb-3">Suggest Friends</h2>
            <div className="space-y-3 overflow-y-scroll h-screen">
                {allUsers &&
                    allUsers.map((user) => (
                        <div
                            key={user._id}
                            className="flex items-center justify-between p-2 bg-gray-100 rounded-md"
                        >
                            <div className="flex items-center space-x-3">
                                {user.profilePic ? (
                                    <img
                                        src={user.profilePic}
                                        alt="profile"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <FaUser className="w-10 h-10 rounded-full text-gray-400 object-cover me-2 shadow-md border border-gray-500" />
                                )}
                                <div>
                                    <p className="font-medium text-gray-800">{user.username}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                            </div>
                            {!reqSent[user._id] ? (
                                <FaUserPlus
                                    className="text-blue-500 text-xl cursor-pointer hover:text-blue-700"
                                    onClick={() => sendRequest(user._id)}
                                />
                            ) : (
                                <FaUserCheck className="text-blue-500 text-xl cursor-pointer hover:text-blue-700" />
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default RightSidebar;
