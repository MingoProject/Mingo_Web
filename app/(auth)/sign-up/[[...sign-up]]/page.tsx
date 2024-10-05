"use client"; // Nếu bạn đang sử dụng Next.js

import React, { useState } from "react";
import { Icon } from "@iconify/react"; // Nếu bạn sử dụng biểu tượng từ iconify

const FloatingLabelInput = ({ id, label, type, value, setValue }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (value === "") {
      setIsFocused(false);
    }
  };

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
        placeholder=" " // Add a placeholder for the space to avoid collapsing
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
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [successMessage, setSuccessMessage] = useState(""); // State for success messages

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra đơn giản (có thể mở rộng)
    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu không khớp!");
      return;
    }

    setErrorMessage("");

    const userData = {
      username,
      fullname: fullName,
      numberphone: phoneNumber,
      email,
      birthday,
      gender,
      password,
      confirmPassword,
      avatar: null, // Thay đổi thành null
      background: null, // Thay đổi thành null
      address: null, // Thay đổi thành null
      job: null, // Thay đổi thành null
      hobbies: [], // Mảng rỗng
      bio: null, // Thay đổi thành null
      nickName: null, // Thay đổi thành null
      friends: [], // Mảng rỗng
      bestFriends: [], // Mảng rỗng
      following: [], // Mảng rỗng
      block: [], // Mảng rỗng
      isAdmin: false,
    };

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Đăng ký thành công! Vui lòng đăng nhập.");
        // Làm sạch biểu mẫu nếu cần
        setUsername("");
        setFullName("");
        setEmail("");
        setPhoneNumber("");
        setBirthday("");
        setGender("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setErrorMessage(data.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      console.error("Lỗi trong quá trình đăng ký:", error);
      setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại sau.");
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
          {/* Username Input */}
          <FloatingLabelInput
            id="username"
            label="Username"
            type="text"
            value={username}
            setValue={setUsername}
          />

          {/* Full Name Input */}
          <FloatingLabelInput
            id="fullName"
            label="Full Name"
            type="text"
            value={fullName}
            setValue={setFullName}
          />

          {/* Email Input */}
          <FloatingLabelInput
            id="email"
            label="Email"
            type="email"
            value={email}
            setValue={setEmail}
          />

          {/* Phone Number Input */}
          <FloatingLabelInput
            id="phoneNumber"
            label="Phone Number"
            type="tel"
            value={phoneNumber}
            setValue={setPhoneNumber}
          />

          {/* Birthday and Gender Inputs */}
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

          {/* Password and Confirm Password Inputs */}
          <div className="mb-6 flex justify-between">
            <div className="mr-2 w-full">
              <FloatingLabelInput
                id="password"
                label="Password"
                type="password"
                value={password}
                setValue={setPassword}
              />
            </div>
            <div className="ml-2 w-full">
              <FloatingLabelInput
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                setValue={setConfirmPassword}
              />
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-primary-100 py-2 text-white transition duration-200"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 flex items-center justify-between">
          <hr className="grow border-gray-300" />
          <span className="mx-2 text-gray-500">or</span>
          <hr className="grow border-gray-300" />
        </div>
        <div className="mt-4 flex justify-center">
          <button className="text-dark100_light500 background-light800_dark400 flex w-32 items-center justify-center rounded-lg p-2 transition duration-200 hover:bg-gray-300">
            <Icon icon="logos:google-icon" className="mr-2" />
            Google
          </button>
          <button className="text-dark100_light500 background-light800_dark400 ml-2 flex w-32 items-center justify-center rounded-lg p-2 transition duration-200 hover:bg-gray-300">
            <Icon icon="logos:facebook" className="mr-2 " />
            Facebook
          </button>
        </div>

        {/* Sign In Link */}
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
