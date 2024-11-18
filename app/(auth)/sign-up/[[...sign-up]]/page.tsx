"use client";

import React, { useState } from "react";
import { register } from "@/lib/services/user.service"; // Import the service function

const FloatingLabelInput = ({ id, label, type, value, setValue }: any) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => value === "" && setIsFocused(false);

  return (
    <div className="relative mb-6">
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`text-dark100_light500 w-full border-b-2 bg-transparent p-2 transition-all duration-200 focus:outline-none ${
          isFocused || value ? "pt-5" : "pt-2"
        }`}
        placeholder=" "
        required
      />
      <label
        htmlFor={id}
        className={`absolute left-2 transition-all duration-200 ${
          isFocused || value
            ? "text-dark100_light500 top-0 text-xs"
            : "text-dark100_light500 top-2 text-sm"
        }`}
      >
        {label}
      </label>
    </div>
  );
};

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    setErrorMessage("");

    const userData = {
      firstName: username,
      lastName: fullName,
      nickName: "",
      phoneNumber,
      email,
      password,
      rePassword: confirmPassword,
      gender: gender === "male",
      birthDay: new Date(birthday),
    };

    try {
      const newUser = await register(userData);

      if (newUser) {
        setSuccessMessage("Registration successful! Please log in.");
        setUsername("");
        setFullName("");
        setEmail("");
        setPhoneNumber("");
        setBirthday("");
        setGender("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setErrorMessage("Registration failed!");
      }
    } catch (error: any) {
      console.error("Error during registration:", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="background-light800_dark400 flex h-screen w-full items-center justify-center">
      <div className="background-light700_dark300 my-[110px] w-[549px] rounded-lg px-[55px] py-[30px] shadow-md">
        <h2 className="text-dark100_light500 mb-6 text-center text-2xl font-bold">
          Sign Up
        </h2>

        {errorMessage && (
          <div className="mb-4 text-center text-red-500">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="mb-4 text-center text-green-500">
            {successMessage}
          </div>
        )}

        <form className="mt-[20px]" onSubmit={handleSubmit}>
          <FloatingLabelInput
            id="username"
            label="Username"
            type="text"
            value={username}
            setValue={setUsername}
          />
          <FloatingLabelInput
            id="fullName"
            label="Full Name"
            type="text"
            value={fullName}
            setValue={setFullName}
          />
          <FloatingLabelInput
            id="email"
            label="Email"
            type="email"
            value={email}
            setValue={setEmail}
          />
          <FloatingLabelInput
            id="phoneNumber"
            label="Phone Number"
            type="tel"
            value={phoneNumber}
            setValue={setPhoneNumber}
          />

          <div className="mb-6 flex justify-between">
            <div className="mr-2 w-full">
              <label
                htmlFor="birthday"
                className="text-dark100_light500 block text-sm font-medium"
              >
                Birthday
              </label>
              <input
                type="date"
                id="birthday"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="text-dark100_light500 w-full border-b-2 bg-transparent p-2 focus:outline-none"
                required
              />
            </div>
            <div className="ml-2 w-full">
              <label
                htmlFor="gender"
                className="text-dark100_light500 mb-2 block text-sm font-medium"
              >
                Gender
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="text-dark100_light500 w-full border-b-2 bg-transparent p-2 focus:outline-none"
                required
              >
                <option value="" disabled>
                  Select your gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="mb-6 flex justify-between">
            <FloatingLabelInput
              id="password"
              label="Password"
              type="password"
              value={password}
              setValue={setPassword}
            />
            <FloatingLabelInput
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              setValue={setConfirmPassword}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary-100 py-2 text-white transition duration-200"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-5 text-center">
          <p className="text-dark100_light500 text-sm">
            Already have an account?{" "}
            <a href="/sign-in" className="text-primary-100 hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return <SignUp />;
}
