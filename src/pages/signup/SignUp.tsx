import React, { useState } from "react";
import { Button, Divider, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../../api/SignUp";
import "./SignUp.css";

function SignUp() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const navigate = useNavigate();

  const handleOnChangeFirstName = (e: string) => {
    setFirstName(e);
  };

  const handleOnChangeLastName = (e: string) => {
    setLastName(e);
  };

  const handleOnChangeEmail = (e: string) => {
    setEmail(e);
  };

  const handleOnChangePassword = (e: string) => {
    setPassword(e);
  };

  const handleOnChangePhoneNumber = (e: string) => {
    setPhoneNumber(e);
  };

  const handleOnChangeAddress = (e: string) => {
    setAddress(e);
  };

  const signUpUser = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    address: string,
    phoneNumber: string
  ) => {
    try {
      const messageObject = await signUp(
        firstName,
        lastName,
        email,
        password,
        address,
        phoneNumber
      );
      if (messageObject.message) {
        navigate("/login")
      }
      console.log(messageObject);
    } catch (err) {
      console.error(err);
      navigate("/signup")
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[280px] h-[530px] bg-[#E7E7E7] p-6 rounded-md">
        <p className="text-center text-lg font-bold mt-2 mb-6">Sign Up</p>
        <div className="flex flex-col items-center space-y-5 mb-5">
          <Input
            placeholder="First Name"
            style={{ height: 30 }}
            className="w-full"
            onChange={(e) => handleOnChangeFirstName(e.target.value)}
            value={firstName}
          />
          <Input
            placeholder="Last Name"
            style={{ height: 30 }}
            className="w-full"
            onChange={(e) => handleOnChangeLastName(e.target.value)}
            value={lastName}
          />
          <Input
            placeholder="Email"
            style={{ height: 30 }}
            className="w-full"
            onChange={(e) => handleOnChangeEmail(e.target.value)}
            value={email}
          />
          <Input
            placeholder="Password"
            type="password"
            style={{ height: 30 }}
            className="w-full"
            onChange={(e) => handleOnChangePassword(e.target.value)}
            value={password}
          />
          <Input
            placeholder="Address"
            style={{ height: 30 }}
            className="w-full"
            onChange={(e) => handleOnChangeAddress(e.target.value)}
            value={address}
          />
          <Input
            placeholder="Phone Number"
            style={{ height: 30 }}
            className="w-full"
            onChange={(e) => handleOnChangePhoneNumber(e.target.value)}
            value={phoneNumber}
          />
          <Divider style={{ borderColor: "black", fontSize: 12 }}>
            Or with
          </Divider>
          <Button
            className="w-full text-[12px] font-bold"
            color="default"
            variant="solid"
            onClick={async () =>
              await signUpUser(
                firstName,
                lastName,
                email,
                password,
                address,
                phoneNumber
              )
            }
          >
            Sign Up
          </Button>
        </div>
        <p className="text-center text-xs">
          Already have an account?{" "}
          <Link
            to="/login"
            className="underline underline-offset-1 text-[#0087E7]"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
