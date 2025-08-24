import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from "../../context/AuthContext";
import SideMenu from '../dashboard/SideMenu';
import axios from "axios";

import defaultAvatar from '../../assets/avatar.jpg';

export default function Profile() {
    const navigate = useNavigate(); 
    const { user, setUser, loading, error } = useAuth();
    const [isEditing, setIsEditing] = React.useState(false);
    const [isChangingPassword, setIsChangingPassword] = React.useState(false);
    const [formData, setFormData] = React.useState({
        firstname: "",
        lastname: "",
        email: "",
        avatar: ""
    });
    const [formPasswordData, setFormPasswordData] = React.useState({
        new_password: "",
        confirm_password: ""
    });

    React.useEffect(() => {
        const token = localStorage.getItem('token'); 
        if (!token) navigate('/signin'); 
    }, [navigate]);

    React.useEffect(() => {
    if (user) {
        setFormData({
            firstname: user.firstname || "",
            lastname: user.lastname || "",
            email: user.email || "",
            avatar: user.avatar || ""
        });
        console.log("user from backend:", user); // ✅ absolute URL should be here
    }
    }, [user]);

    React.useEffect(() => {
        console.log("formData updated:", formData);
    }, [formData]);

    const handleChange = (e) => {
        if (e.target.name === "avatar") {
            setFormData({
                ...formData,
                avatar: e.target.files[0],  // <-- actual file object
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handlePasswordChange = (e) => {
        setFormPasswordData({
            ...formPasswordData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

            const data = new FormData();
            data.append("firstname", formData.firstname);
            data.append("lastname", formData.lastname);
            data.append("email", formData.email);
            if (formData.avatar) {
                data.append("avatar", formData.avatar);
            }

            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/customers/update/`,
                data,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            // ✅ Update user in context with fresh data from backend
            if (res.data && setUser) {
                setUser(res.data);
            }

            alert("Profile updated successfully!");
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert("Error updating profile");
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

           

            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/customers/password-update/`,
                formPasswordData,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                       
                    },
                }
            );

            if (res.data) {
                alert("Password updated successfully!");
            }

            setIsChangingPassword(false);
        } catch (err) {
            console.error(err);
            alert("Error updating profile");
        }
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching user data</div>;

    return (
        <div className="profile-section">
            <SideMenu />
            <div className="profile-container">
                <div className='profile-info'>
                    <div className='profile-image'>
                        <img src={user.avatar || defaultAvatar} alt="Profile" />
                    </div>
                    <div className='profile-details'>
                        <h2>{user.firstname} {user.lastname}</h2>
                        <p className='email'>{user.email}</p>
                        <p className='role'>{user.role}</p>
                    </div>
                </div>

                <div className='profile-actions'>
                    <button 
                        className='edit-profile' 
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? "Cancel" : "Edit Profile"}
                    </button>
                    <button 
                        className='change-password'
                        onClick={() => setIsChangingPassword(!isChangingPassword)}
                    >
                        Change Password
                    </button>
                </div>

                {isEditing && (
                    <form className="profile-form" onSubmit={handleSubmit}>
                        <label>
                            First Name:
                            <input 
                                type="text" 
                                name="firstname" 
                                value={formData.firstname} 
                                onChange={handleChange} 
                            />
                        </label>
                        <label>
                            Last Name:
                            <input 
                                type="text" 
                                name="lastname" 
                                value={formData.lastname} 
                                onChange={handleChange} 
                            />
                        </label>
                        <label>
                            Email:
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                disabled
                            />
                        </label>
                        <label>
                            Update Profile picture:
                            <input 
                                type="file" 
                                name="avatar" 
                                
                                onChange={handleChange} 
                            />
                        </label>
                        <button type="submit" className="save-btn">Save Changes</button>
                    </form>
                )}
                {isChangingPassword && (
                    <form className="profile-form" onSubmit={handlePasswordSubmit}>
                        <h3>Change Password</h3>

                        <label>
                            New Password:
                            <input 
                                type="password" 
                                name="new_password" 
                                value={formPasswordData.new_password} 
                                onChange={handlePasswordChange} 
                            />
                        </label>
                        <label>
                            Confirm Password:
                            <input 
                                type="password" 
                                name="confirm_password" 
                                value={formPasswordData.confirm_password} 
                                onChange={handlePasswordChange} 

                            />
                        </label>
                        
                        <button type="submit" className="save-btn">Change Password</button>
                    </form>
                )}
            </div>
        </div>
    );
}
