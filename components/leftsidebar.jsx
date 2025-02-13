import { useEffect, useState } from "react";
import { FaHome, FaUserFriends, FaStar, FaEnvelope, FaCog } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import axiosInstance from "./middaleware";
import { Link } from "react-router-dom";

const LeftSidebar = () => {
    const [firendList, setFirendList] = useState()
    const [pendingRequests, setPendingRequests] = useState()

    const senderId = localStorage.getItem('user_Id')

    // single user
    const singleUser = async () => {
        try {
            const response = await axiosInstance("/singleuser");
            setFirendList(response.data.user.friends);

        } catch (error) {
            console.log("single failed:", error);
        }
    };


    // get pending requests

    const getPendingRequests = async () => {
        try {
            const res = await axiosInstance.get(`/pending`)
            setPendingRequests(res.data)
            console.log(" pending requests==>", res.data)
        } catch (error) {
            console.log("pending requests error", error.message);

        }
    }
        ;

    useEffect(() => {
        getPendingRequests()
        singleUser()
    }, [])

    // request accepte

    const requestAccept = async (requestId) => {
        try {
            await axiosInstance.post("/accept", { requestId });
            getPendingRequests()
            singleUser()
        } catch (error) {
            console.log("accepted error", error.response.data);

        }
        console.log("request id ", requestId);

    }

    // reject request

    const rejectRequest = async (requestId) => {
        try {
            const res = await axiosInstance.post("/reject", { requestId });
            console.log("reject successfully", res.data);
            getPendingRequests()
        } catch (error) {
            console.log("rejected error", error.response.data);

        }
        console.log("request id ", requestId);



    }

    // unfriend

    const unFriend = async (id) => {
        try {
            const res = await axiosInstance.post('/unfriend' , {
                receiverId: id,
                senderId
            })
            console.log("unfriend successfully:" , res.data);
            singleUser()
            
        } catch (error) {
            console.log("usfriend error:", error);
            
        }

    }


    return (
        <>
            <div className="w-full h-[565px] bg-white p-4 shadow-lg overflow-auto ">
                {/* Logo */}
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Scrolllink</h2>


                <nav className="space-y-4">
                    <Link href="#" className="flex items-center gap-3 text-pink-500 font-medium">
                        <FaHome />
                        Feed
                    </Link>
                    <button onClick={() => document.getElementById('my_modal_1').showModal()}>

                        <Link href="#" className="flex items-center gap-3 text-gray-700 hover:text-pink-500" >
                            <FaUserFriends />
                            Friends


                        </Link>
                    </button>

                    <Link href="#" className="flex items-center gap-3 text-gray-700 hover:text-pink-500">
                        <FaStar />
                        My favorites
                    </Link>
                    <Link href="#" className="flex items-center gap-3 text-gray-700 hover:text-pink-500">
                        <FaEnvelope />
                        Messages
                    </Link>
                    <Link href="#" className="flex items-center gap-3 text-gray-700 hover:text-pink-500">
                        <FaCog />
                        Settings
                    </Link>
                </nav>

                {/* Divider */}
                <hr className="my-6 border-gray-300" />

                {/* My Contacts */}
                <h3 className="text-gray-800 font-semibold mb-4">Friend requests</h3>
                <div className="space-y-4">

                    {pendingRequests ? pendingRequests?.map((pendings) => (
                        <div key={pendings.sender._id} className="flex items-center gap-3 hover:cursor-pointer hover:bg-gray-100 rounded-xl">
                            {pendings.sender.profilePic && pendings.sender.profilePic ? <img
                                src={pendings.sender.profilePic}
                                alt="profile"
                                className="w-12 h-12 rounded-full object-cover"
                            /> : <FaUser className="w-10 h-10 rounded-full text-gray-400 object-cover me-2 shadow-md border border-gray-500" />}
                            <div>
                                <p className="text-gray-800 font-medium">{pendings.sender.username}</p>
                                <button className="btn btn-sm bg-blue-600 hover:bg-blue-800  text-white mt-2" onClick={() => requestAccept(pendings._id)}>Confirm</button>
                                <button className="btn btn-sm bg-gray-500 hover:bg-gray-600 text-white mt-2 ms-2" onClick={() => rejectRequest(pendings._id)}>Cencal</button>
                                <p className="text-gray-500 text-sm"></p>
                            </div>
                        </div>
                    )) : <p>Reuest not found</p>}
                </div>
            </div>

            {/* friend list modal */}
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Friends

                    </h3>
                    <div className="space-y-4 mt-5">
                        {firendList && firendList?.filter((item)=> !firendList.includes(item._id)).map((users) => (
                            <div key={users._id} className="flex items-center gap-3  hover:cursor-pointer hover:bg-gray-100 rounded-2xl">
                                {users.profilePic && users.profilePic ? <img
                                    src={users.profilePic}
                                    alt="profile"
                                    className="w-12 h-12 rounded-full object-cover"
                                /> : <FaUser className="w-10 h-10 rounded-full text-gray-400 object-cover me-2 shadow-md border border-gray-500" />}
                                <div>
                                    <p className="text-gray-800 font-medium">{users.username}</p>
                                    <p className="text-gray-500 text-sm">{users.email}</p>
                                    <button className="btn btn-sm bg-blue-600 text-white mt-2">Profile</button>
                                    <button className="btn btn-sm ms-2 bg-gray-300 mt-2" onClick={() => unFriend(users._id)}>Unfriend</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default LeftSidebar;
