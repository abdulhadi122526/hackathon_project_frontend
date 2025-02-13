import { useEffect, useState } from "react";
import { TiLocationArrowOutline } from "react-icons/ti";
import { FaUser } from "react-icons/fa6";
import axiosInstance from "../../components/middaleware";
import { FaVideo, FaSmile, FaImages } from "react-icons/fa";
import { HiMenuAlt3 } from "react-icons/hi";
import { CiMenuKebab } from "react-icons/ci";
import LeftSidebar from "../../components/leftsidebar";
import RightSidebar from "../../components/rightsidebar";





const Home = () => {
  const [data, setDate] = useState()
  const [text, setText] = useState("");
  const [commentInput, setCommentInput] = useState({})
  const [uploadImage, setUploadImage] = useState()



  const token = localStorage.getItem("access_token")
  const userProfileImage = localStorage.getItem("user_profile_image")


  const getAllPosts = async () => {
    try {
      const response = await axiosInstance.get('/posts')
      setDate(response.data)
      console.log(data.user.profilePic);


    } catch (error) {
      console.log(error.message);

    }

  }
  useEffect(() => {
    if (!token) return alert("please login your account")
    getAllPosts()
  }, [])

  // upload post
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        alert("please log in your account")
        return
      }
      const response = await axiosInstance.post("/createpost", {
        text,
        uploadImage,
      })
      console.log(response.data);
      localStorage.removeItem("upload_image")
    } catch (error) {
      console.log("creat post fiels ==>", error.response ? error.response.data : error.message);
    }

    setText("");
    getAllPosts()
  };

  // imageupload

  let myWidget = cloudinary.createUploadWidget({
    cloudName: 'dkiexi2xx',
    uploadPreset: 'expertizo-hackathon'


  }, (error, result) => {
    if (!error && result && result.event === "success") {
      console.log('Done! Here is the image info: ', result.info);
      setUploadImage(result.info.url)
      localStorage.setItem("upload_image", result.info.url)
    }
  })

  // delete post
  const deletePost = async (id) => {
    try {
      const response = await axiosInstance.delete(`/posts/${id}`)
      console.log(response);
    } catch (error) {
      console.log("Error deleting post", error);

    }
    getAllPosts()
  }

  // like post

  const likePost = async (id) => {
    console.log(id);

    try {
      const response = await axiosInstance.post('/like', {
        postId: id,
      })
      console.log("liked post", response.data);

    } catch (error) {

      console.log("post unlike", error.response?.data);
    }
    getAllPosts();
  }

  // comment post

  const commentPost = async (id) => {
    try {
      const response = await axiosInstance.post('/comment', {
        text: commentInput[id],
        postId: id,
      },
      )
      console.log("comment submit", response.data);
      getAllPosts();
      setCommentInput((prev) => ({
        ...prev,
        [id]: "",
      }));
    } catch (error) {
      console.log("comment post error==>", error.message);
    }

  }


  //delete comments
  const deleteComment = async (id) => {
    console.log(id)
    try {
      const response = await axiosInstance.delete(`/deleteComment/${id}`)
      console.log(response);
    } catch (error) {
      console.log(error.response.data);

    }
    getAllPosts()
  }

  return (
    <>
      {/* post uploading */}
      <div className="min-h-screen bg-gray-100 flex justify-between">
        <div className="w-72 bg-white shadow-lg fixed left-0 top-0 h-full ms-2 mt-18 rounded-lg">
          <LeftSidebar />
        </div>


        <div className="flex-1 pt-20 bg-gray-100 pb-10 mx-auto max-w-xl px-4 ">
          <div className="max-w-2xl mx-auto  bg-white p-6 rounded-lg shadow-lg mb-12 ">
            <form onSubmit={handleSubmit}>
              {/* Content Field */}
              <div className="mb-4 flex items-center gap-3">
                {userProfileImage && userProfileImage ? <img
                  src={userProfileImage}
                  alt="profile"
                  className="w-12 h-12 rounded-full object-cover"
                /> : <FaUser className="w-10 h-10 rounded-full text-gray-400 object-cover me-2 shadow-md border border-gray-500" />}

                <input
                  type="text"
                  placeholder="What's happening"
                  id="content"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="input input-bordered w-full h-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Buttons Section */}
              <div>
                {localStorage.getItem('upload_image') && <img src={localStorage.getItem("upload_image")} alt="uploaded pic" width='200px' height='200px' className="rounded-md" />}
                
              </div>
              <div className="flex items-center justify-between mt-4 ms-5">
                <div className="flex gap-6 text-gray-500">
                  <button className="flex items-center gap-2 hover:cursor-pointer">
                    <FaVideo className="text-red-500" /> Live video
                  </button>
                  <button className="flex items-center gap-2 hover:cursor-pointer" onClick={() => myWidget.open()}>
                    <FaImages className="text-green-500" /> Photo
                  </button>
                  <button className="flex items-center gap-2 hover:cursor-pointer">
                    <FaSmile className="text-yellow-500" /> Feeling
                  </button>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-pink-500 text-white font-medium rounded-md hover:bg-pink-600 transition hover:cursor-pointer"
                >
                  Post
                </button>
              </div>
            </form>
          </div>

          {/* posts rendering */}

          {data && data?.filter((item) => item.user && item.user._id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item) => {
            return (
              <div key={item._id} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg mb-6 relative">
                {/* delete post */}
                <div className="dropdown dropdown-hover absolute end-1 top-1 ">
                  <div tabIndex={0} role="button" className="m-1 text-xl hover:text-blue-500 hover:cursor-pointer"><HiMenuAlt3 /></div>
                  <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] shadow">
                    <li><button onClick={() => { deletePost(item._id) }}>Delete</button></li>
                  </ul>
                </div>
                {/* Profile Picture Area */}
                <div className="flex items-center space-x-4 mb-4">
                  {item.user.profilePic && item.user.profilePic ? <img src={item.user.profilePic}
                    alt={`${item.user.username}'s profile`}
                    className="w-13 h-13 rounded-full  object-cover me-5 shadow-md border border-gray-500"
                  /> : <FaUser className="w-12 h-12 rounded-full text-gray-400 object-cover me-2 shadow-md border border-gray-500" />}

                  <div>
                    <p className="font-semibold text-gray-800">{item.user.username && item.user.username}</p>
                    <p className="text-gray-500 text-sm">{item.createdAt && item.createdAt}</p>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">{item.title}</h2>
                <p className="text-gray-600 text-xl mb-6 ms-5 ">
                  {item.text}
                </p>
                {item.uploadImage && item.uploadImage ? <img src={item.uploadImage} alt="image" className="w-full h-full mb-3 rounded-2xl" /> : null}

                {/* comment rendering */}
                <div className="mb-2 border border-gray-200 p-5 rounded-lg">
                  <h1 className="text-xl font-semibold ms-3 mb-2">Comments</h1>
                  {item.comments.map((comments) => {
                    return (
                      <div key={comments._id} className="flex">
                        <div>
                          {comments.user.profilePic && comments.user.profilePic ? <img src={comments.user.profilePic}
                            alt={`${comments.user.profilePic}'s profile`}
                            className="w-12 h-12 rounded-full  object-cover me-2 shadow-md border border-gray-500"
                          /> : <FaUser className="w-10 h-10 mt-3 rounded-full me-2 shadow-md border border-gray-500 text-gray-400" />}

                        </div>
                        <div className="mb-3 bg-gray-50 px-5 rounded-xl relative max-w-full">
                          <div className="mt-4 break-words">
                            <p className="font-semibold">{comments.user.username}</p>
                            <p className="max-w-full">
                              {comments.text}
                            </p>
                          </div>

                        </div>
                        {/* delete comment button */}
                        <div className="dropdown dropdown-right">
                          <div tabIndex={0} role="button" className="mt-6 m-1 hover:cursor-pointer"><CiMenuKebab /></div>
                          <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1]  p-2 shadow">
                            <li>    <button
                              className="text-red-700"
                              onClick={() => deleteComment(comments._id)}
                            > Delete
                            </button></li>
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                  {/* add comments */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      commentPost(item._id);
                    }}
                    className="relative flex items-center gap-2 bg-gray-100 p-2 rounded-2xl"
                  >
                    {/* Profile Picture */}
                    {item.user.profilePic && item.user.profilePic ? <img src={item.user.profilePic}
                      alt={`${item.user.profilePic}'s profile`}
                      className="w-8 h-8 rounded-full  object-cover me-2 shadow-md border border-gray-500"
                    /> : <FaUser className="w-8 h-8 rounded-full me-2 shadow-md border border-gray-500 text-gray-400" />}

                    {/* Input Field */}
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentInput[item._id]}
                      className="flex-1 px-4 py-2 bg-white rounded-full border border-gray-300 focus:outline-none"
                      onChange={(e) =>
                        setCommentInput((prev) => ({
                          ...prev,
                          [item._id]: e.target.value,
                        }))
                      }
                    />

                    {/* Send Button */}
                    <button className="text-pink-500 bg-pink-200 hover:cursor-pointer  hover:text-pink-700 p-2 rounded-xl">
                      <TiLocationArrowOutline className="text-2xl" />
                    </button>
                  </form>

                </div>

                <div className="flex items-center space-x-4 relative mt-5">
                  <div className="absolute end-2 text-sm">
                    <span>{item.comments.length} Comments</span>
                    <span className="ml-4">{item.like.length} Likes</span>
                  </div>
                  {/* add likes  */}
                  <button
                    onClick={() => {
                      likePost(item._id);
                    }}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition hover:cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11V5a7 7 0 0114 0v6" />
                    </svg>
                    <span>Like</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition hover:cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h10M7 12h10m-7 5h7" />
                    </svg>
                    <span>Comment</span>
                  </button>
                </div>
              </div>
            );
          })}

        </div>
        <div className="w-72 bg-white shadow-lg fixed right-0 top-0 h-full  mt-18 rounded-lg">
          <RightSidebar />
        </div>
      </div>

    </>
  )
}

export default Home