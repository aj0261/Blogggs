import { useState } from "react";
import axios from "axios";
import { Appbar } from "../components/Appbar";
import { BACKEND_URL } from "../config";

export const SettingsPage = () => {
    const [bio, setBio] = useState("");
    const [message, setMessage] = useState("");

    const handleUpdateProfile = async () => {
        try {
            const response = await axios.put(`${BACKEND_URL}/api/v1/user/profile`,
                { bio },
                { headers: { Authorization: localStorage.getItem("token") } }
            );
            setMessage(response.data.message || "Profile updated!");
        } catch (e) {
            setMessage("Failed to update profile.");
        }
    };
    
    return (
        <div>
            <Appbar />
            <div className="max-w-2xl mx-auto p-8">
                <h1 className="text-3xl font-bold mb-6">Settings</h1>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Your Bio</label>
                        <textarea
                            id="bio"
                            rows={4}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Tell everyone a little bit about yourself..."
                        />
                    </div>
                    <button
                        onClick={handleUpdateProfile}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                    {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
                </div>
            </div>
        </div>
    );
};