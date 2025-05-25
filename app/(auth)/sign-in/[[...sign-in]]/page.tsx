"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  getMyProfile,
  login,
  updateUserStatus,
} from "@/lib/services/user.service";
import { useAuth } from "@/context/AuthContext";
import InputTitle from "@/components/ui/inputTitle";
import Button from "@/components/ui/button";

const SignIn = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const { setProfile } = useAuth();

  const handleSubmit = async () => {
    const userData = { phoneNumber, password };

    try {
      const user = await login(userData);
      await updateUserStatus(user.token);
      if (user) {
        localStorage.setItem("token", user.token);
        const decodedToken = JSON.parse(atob(user.token.split(".")[1]));
        const userId = decodedToken?.id;
        localStorage.setItem("userId", userId);
        const profileData = await getMyProfile(userId);
        setProfile(profileData.userProfile);
        router.push("/");
      } else {
        setErrorMessage("Đăng nhập không thành công!");
      }
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error);

      if (error?.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (typeof error === "string") {
        setErrorMessage(error);
      } else {
        setErrorMessage(
          "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin."
        );
      }
    }
  };

  return (
    <div className="background-light500_dark500 flex h-screen w-full items-center justify-center">
      <div className="background-light200_dark200 my-[110px] w-[540px] rounded-lg p-12 shadow-md flex flex-col gap-8">
        <div>
          <p className="text-dark100_light100 text-center text-[48px] font-medium">
            Welcome Back !
          </p>
          <p className="text-dark100_light100 text-center text-4 font-normal">
            Enter your phone number and password to access your account
          </p>
          {errorMessage && (
            <p className="text-center text-red-500">{errorMessage}</p>
          )}
        </div>
        <div className="w-full flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <InputTitle
              label="Phone number"
              placeholder="Enter your address"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <div>
              <InputTitle
                label="Password"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="mt-2 text-end">
                <a
                  href="/forget-password"
                  className="text-dark100_light100 text-[14px] font-normal hover:underline"
                >
                  Forget password?
                </a>
              </div>
            </div>
          </div>
          <Button title="Sign In" size="large" onClick={handleSubmit} />

          <div className="text-center">
            <p className="text-dark100_light100 text-4 font-nomal">
              You don&apos;t have an account yet ?{" "}
              <a
                href="/sign-up"
                className="text-dark100_light100 text-4 font-semibold hover:underline"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return <SignIn />;
}
