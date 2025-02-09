import axios from "axios";
import { FaUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";



const Navbar = () => {
    const navigate = useNavigate();

    const userProfileImage = localStorage.getItem("user_profile_image")
    const userProfileUsername = localStorage.getItem("user_profile_username")



    const logOutUser = async () => {
        try {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem('user_profile_image')
            localStorage.removeItem('user_profile_username')
            localStorage.removeItem('user_Id')
            await axios.post("http://localhost:3000/api/v1/logout");
        } catch (error) {
            console.log("Error logging out:", error.response.data);
            
        }
        window.dispatchEvent(new Event("authChanged"));
        navigate("/");
    };

    

    return (
        <>

            <div className="navbar bg-base-100 flex justify-between items-center px-4 fixed top-0 z-10 ">
                {/* Left Section - Logo and Search */}
                <div className="flex items-center gap-4 ms-10">
                    <a className="btn btn-ghost text-xl">Scrolllink</a>
                    <div className="form-control w-[400px] ms-16">
                        <input
                            type="text"
                            placeholder="Search"
                            className="input input-bordered w-full rounded-xl"
                        />
                    </div>
                </div>

                {/* Right Section - Username and Profile */}
                <div className="flex items-center gap-3 me-5">
                    <span className="text-md font-medium">{userProfileUsername}</span>
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                {userProfileImage && userProfileImage ? <img
                                    src={userProfileImage}
                                    alt="profile"
                                    className="w-12 h-12 rounded-full object-contain"
                                /> : <FaUser className="w-10 h-10 rounded-full text-gray-400 object-cover me-2 shadow-md border border-gray-500" />}
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow ">
                            {localStorage.getItem("access_token") ? <li><Link to="/home">Home</Link></li> : false}

                            <li><button onClick={() => document.getElementById('my_modal_5').showModal()}>Friend request</button></li>
                            <li>
                                {localStorage.getItem('access_token') ? (
                                    <button onClick={logOutUser}>Logout</button>
                                ) : (
                                    <Link to="/">Login</Link>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Friend requests</h3>
                    <p className="py-4">Press ESC key or click the button below to close</p>
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

export default Navbar;