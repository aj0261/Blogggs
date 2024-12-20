import { Link, useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import { signinInput } from "@aj____/medium-common";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<signinInput>({
        email: "",
        password: "",
        name: "",
    });

    async function sendRequest(event: React.FormEvent) {
        event.preventDefault(); // Prevent default form submission
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
                postInputs
            );
            const jwt = response.data;
            localStorage.setItem("token", jwt);
            navigate("/blogs");
        } catch (error) {
            console.error("Error during authentication:", error);
        }
    }

    return (
        <div className="h-screen flex justify-center items-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                        {type === "signup" ? "Create an account" : "Sign in"}
                    </h1>
                    <p className="text-gray-600">
                        {type === "signin"
                            ? "Don't have an account?"
                            : "Already have an account?"}{" "}
                        <Link
                            className="text-gray-700 underline hover:text-gray-900"
                            to={type === "signin" ? "/signup" : "/signin"}
                        >
                            {type === "signin" ? "Sign up" : "Sign in"}
                        </Link>
                    </p>
                </div>
                <form className="space-y-4" onSubmit={sendRequest}>
                    <LabelledInput
                        label="Email"
                        placeholder="@gmail.com"
                        onChange={(e) => {
                            setPostInputs({
                                ...postInputs,
                                email: e.target.value,
                            });
                        }}
                    />
                    <LabelledInput
                        label="Password"
                        type="password"
                        placeholder="********"
                        onChange={(e) => {
                            setPostInputs({
                                ...postInputs,
                                password: e.target.value,
                            });
                        }}
                    />
                    {type === "signup" && (
                        <LabelledInput
                            label="Name"
                            placeholder="Name"
                            onChange={(e) => {
                                setPostInputs({
                                    ...postInputs,
                                    name: e.target.value,
                                });
                            }}
                        />
                    )}
                    <button
                        type="submit"
                        className="mt-6 w-full bg-gray-800 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
                    >
                        {type === "signup" ? "Sign up" : "Sign in"}
                    </button>
                </form>
            </div>
        </div>
    );
};

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
    return (
        <div>
            <label
                htmlFor={label.toLowerCase()}
                className="block text-sm font-medium text-gray-800 mb-1"
            >
                {label}
            </label>
            <input
                onChange={onChange}
                type={type || "text"}
                id={label.toLowerCase()}
                className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg shadow-sm focus:ring-gray-600 focus:border-gray-600 block p-2.5 transition"
                placeholder={placeholder}
                required
            />
        </div>
    );
}
