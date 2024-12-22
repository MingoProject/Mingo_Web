"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { findUserByPhoneNumber } from "@/lib/services/user.service";
import { resetPassword, sendOTP, verifyOTP } from "@/lib/services/auth.service";
import { Icon } from "@iconify/react/dist/iconify.js";

const FloatingLabelInput = ({ id, label, type, value, setValue }: any) => {
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
        className={`w-full border-b-2 bg-transparent p-2 transition-all duration-200 ${
          isFocused || value ? "pt-5" : "pt-2"
        }`}
        placeholder=" "
        required
      />
      <label
        htmlFor={id}
        className={`absolute left-2 transition-all duration-200 ${
          isFocused || value ? "top-0 text-xs" : "top-2 text-sm"
        }`}
      >
        {label}
      </label>
    </div>
  );
};

const ForgetPassword = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userExists = await findUserByPhoneNumber(phoneNumber);
      if (!userExists) {
        setErrorMessage("No user found with this phone number.");
        return;
      }
      await sendOTP(phoneNumber);
      setStep(2);
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isOtpValid = await verifyOTP(phoneNumber, otp);
      if (!isOtpValid) {
        setErrorMessage("Invalid OTP. Please try again.");
        return;
      }
      setStep(3);
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    try {
      await resetPassword(phoneNumber, newPassword);
      setStep(1);
      setErrorMessage("");
      alert("Password reset successfully!");
      router.push("/sign-in");
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    try {
      await sendOTP(phoneNumber);
    } catch (error) {
      setErrorMessage("resend failed. Please try again.");
    }
  };

  const handleBack = () => {
    router.push("/sign-in");
  };

  return (
    <div className="background-light800_dark400 text-dark100_light500 flex h-screen w-full items-center justify-center">
      <div className="background-light700_dark300 w-[400px] rounded-lg p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold">Forget Password</h2>

        {errorMessage && (
          <p className="text-center text-red-500">{errorMessage}</p>
        )}

        {step === 1 && (
          <form onSubmit={handlePhoneSubmit}>
            <FloatingLabelInput
              id="phone"
              label="Phone Number"
              type="text"
              value={phoneNumber}
              setValue={setPhoneNumber}
            />
            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-primary-100 py-2 text-white"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <FloatingLabelInput
              id="otp"
              label="Enter OTP"
              type="text"
              value={otp}
              setValue={setOtp}
            />
            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-primary-100 py-2 text-white"
            >
              Verify OTP
            </button>

            <p className="text-dark100_light500 mt-5 flex  text-sm">
              You haven&apos;t recieved OTP yet ?{" "}
              <p
                onClick={handleResendOTP}
                className="ml-2 cursor-pointer text-primary-100 hover:underline"
              >
                Resend
              </p>
            </p>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordSubmit}>
            <FloatingLabelInput
              id="newPassword"
              label="New Password"
              type="password"
              value={newPassword}
              setValue={setNewPassword}
            />
            <FloatingLabelInput
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              setValue={setConfirmPassword}
            />
            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-primary-100 py-2 text-white"
            >
              Reset Password
            </button>
          </form>
        )}

        <div className="mt-5 flex" onClick={handleBack}>
          <Icon
            icon="weui:back-outlined"
            className="mt-[2px]"
            width="20"
            height="16"
          />
          <span className=" text-center text-base">back</span>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return <ForgetPassword />;
}
