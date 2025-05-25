"use client";

import React, { useState } from "react";
import { register } from "@/lib/services/user.service";
import { sendOTP, verifyOTP } from "@/lib/services/auth.service";
import { useRouter } from "next/navigation";
import InputTitle from "@/components/ui/inputTitle";
import Button from "@/components/ui/button";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [emailError, setEmailError] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleNextStep = () => {
    setErrorMessage("");
    if (step === 3) {
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match!");
        return;
      }
      sendOTP(phoneNumber)
        .then(() => {
          setStep(4);
        })
        .catch((err) => {
          setErrorMessage(err.message || "Failed to send OTP.");
        });
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleOtpSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const verifyResult = await verifyOTP(phoneNumber, otp);

      if (!verifyResult.success) {
        setErrorMessage("Invalid or expired OTP.");
        return;
      }

      const userData = {
        firstName,
        lastName,
        nickName: "",
        phoneNumber,
        email,
        password,
        rePassword: confirmPassword,
        gender: gender === "male",
        birthDay: new Date(birthday),
      };

      const newUser = await register(userData);
      if (newUser) {
        setSuccessMessage("Registration successful! Redirecting...");
        setTimeout(() => router.push("/sign-in"), 1500);
      } else {
        setErrorMessage("Registration failed!");
      }
    } catch (error: any) {
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  const handleResendOTP = async () => {
    try {
      await sendOTP(phoneNumber);
      setSuccessMessage("OTP resent successfully.");
    } catch {
      setErrorMessage("Failed to resend OTP.");
    }
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Email không hợp lệ");
    } else {
      setEmailError("");
    }
  };

  return (
    <div className="background-light500_dark500 flex h-screen w-full items-center justify-center">
      <div className="background-light200_dark200 w-[500px] rounded-lg p-10 shadow-md flex flex-col gap-8">
        <div>
          <p className="text-dark100_light100 text-center text-[32px] font-semibold">
            {step < 4 ? `Sign up` : "Verify OTP"}
          </p>
          <p className="text-dark100_light100 text-center text-4 font-normal">
            Create your new account
          </p>
          {errorMessage && (
            <div className=" text-center text-red-500">{errorMessage}</div>
          )}
          {successMessage && (
            <div className=" text-center text-green-500">{successMessage}</div>
          )}
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div className="flex gap-2">
              <InputTitle
                label="First Name"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <InputTitle
                label="Last Name"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <InputTitle
              label="Email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
            <InputTitle
              label="Phone Number"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        )}

        {step === 2 && (
          <div className="mb-6 flex gap-4">
            <div className="w-1/2">
              <label className="block mb-1 font-medium text-sm">Birthday</label>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full border-b-2 p-2 focus:outline-none"
              />
            </div>
            <div className="w-1/2">
              <label className="block mb-1 font-medium text-sm">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full border-b-2 bg-transparent p-2 focus:outline-none"
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6">
            <InputTitle
              label="Password"
              placeholder="Enter password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputTitle
              label="Confirm Password"
              placeholder="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-6">
            <InputTitle
              label="OTP"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button title="Verify OTP" size="large" onClick={handleOtpSubmit} />
            <p className="text-center text-sm">
              Didn’t receive OTP?{" "}
              <span
                onClick={handleResendOTP}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Resend
              </span>
            </p>
          </div>
        )}

        {step < 4 && (
          <div className="mt-6">
            <Button
              title={step === 3 ? "Send OTP" : "Continue"}
              size="large"
              onClick={handleNextStep}
            />
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-dark100_light100 text-sm">
            Already have an account?{" "}
            <a
              href="/sign-in"
              className="text-dark100_light100 hover:underline font-semibold"
            >
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
