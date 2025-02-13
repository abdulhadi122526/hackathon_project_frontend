import { FaUser } from "react-icons/fa";
import axiosInstance from "./middaleware";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCheck, FaUserPlus } from "react-icons/fa6";

const RightSidebar = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [reqSent, setReqSent] = useState({});
    const [friendList, setFriendList] = useState([]);

    const reqSenderId = localStorage.getItem("user_Id");

    const getAllUsers = async () => {
        try {
            const response = await axios("http://localhost:3000/api/v1/users");
            setAllUsers(response.data.user);
            console.log("all users==>", response.data.user);

        } catch (error) {
            console.log("Fetching users failed:", error);
        }
    };
    // single user
    const getFriendList = async () => {
        try {
            const response = await axiosInstance("/singleuser"); 
            setFriendList(response.data.user.friends.map(friend => friend._id)); // ✅ Convert to simple array of IDs
            console.log("Friend list:", response.data.user.friends.map(friend => friend._id));
        } catch (error) {
            console.log("Fetching friends failed:", error);
        }
    };


    // send friend re

    const sendRequest = async (id) => {
        try {
            const res = await axiosInstance.post("/send", { senderId: reqSenderId, receiverId: id });
            setReqSent((prev) => ({ ...prev, [id]: true }));
            localStorage.setItem("requestId", res.data.request._id)
            console.log(res.data.request.receiver);

        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        getAllUsers();
        sendRequest()
        getFriendList()

    }, []);
    return (
        <div className="w-72 bg-white shadow-lg rounded-lg p-4">
            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search Stories"
                    className="w-full px-3 py-2 border rounded-md"
                />
            </div>

            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-3">Suggested Friends</h2>
                <div className="h-[26.8rem] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {allUsers && allUsers?.filter((item) => item._id !== reqSenderId &&
                        !reqSent[item._id] &&
                        !friendList.some(friendId => friendId === item._id)
                    ).map((friend) => (
                        <div key={friend._id} className="flex items-center justify-between p-3 border-b">
                            <div className="flex items-center gap-3">
                                {friend.profilePic && friend.profilePic ? <img src={friend.profilePic} className="w-10 h-10 text-gray-400 border rounded-full object-cover" /> : <FaUser className="w-10 h-10 text-gray-400 border rounded-full" />}

                                <div>
                                    <p className="font-semibold">{friend.username}</p>
                                    <p className="text-sm text-gray-500">{friend.email}</p>
                                </div>
                            </div>
                            {!reqSent[friend._id] ? (
                                <FaUserPlus className="text-blue-500 text-xl cursor-pointer hover:text-blue-700" onClick={() => sendRequest(friend._id)} />
                            ) : (
                                <FaUserCheck className="text-green-500 text-xl cursor-pointer" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default RightSidebar;
