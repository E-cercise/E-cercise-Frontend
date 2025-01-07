import React, { useState } from "react";
import { AutoComplete, Button, Divider } from "antd";
import { Link } from "react-router-dom";
import "./SignUp.css";

function SignUp() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const handleOnChangeFirstName = (e: string) => {
    setFirstName(e);
  }

  const handleOnChangeLastName = (e: string) => {
    setLastName(e);
  }

  const handleOnChangeEmail = (e: string) => {
    setEmail(e);
  };

  const handleOnChangePassword = (e:string) => {
    setPassword(e);
  }

  const handleOnChangeConfirmPassword = (e:string) => {
    setConfirmPassword(e);
  }

  const handleOnChangeAddress = (e:string) => {
    setAddress(e);
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[280px] h-[530px] bg-[#E7E7E7] p-6 rounded-md">
        <p className="text-center text-lg font-bold mt-2 mb-6">Sign Up</p>
        <div className="flex flex-col items-center space-y-5 mb-5">
          <AutoComplete
            placeholder="First Name"
            style={{ height: 30 }}
            className="w-full"
            onChange={(e) => handleOnChangeFirstName(e)}
            value={firstName}
          />
          <AutoComplete
            placeholder="Last Name"
            style={{ height: 30 }}
            className="w-full"
            onChange={(e) => handleOnChangeLastName(e)}
            value={lastName}
          />
          <AutoComplete
            placeholder="Email"
            style={{ height: 30 }}
            className="w-full"
            onChange={(e) => handleOnChangeEmail(e)}
            value={email}
          />
          <AutoComplete
            placeholder="Password"
            style={{ height: 30 }}
            className="w-full"
            onChange={(e) => handleOnChangePassword(e)}
            value={password}
          />
          <AutoComplete
            placeholder="Confirm Password"
            style={{ height: 30 }}
            className="w-full"
            onChange={(e) => handleOnChangeConfirmPassword(e)}
            value={confirmPassword}
          />
          <AutoComplete
            placeholder="Address"
            style={{ height: 30 }}
            className="w-full"
            onChange={(e) => handleOnChangeAddress(e)}
            value={address}
          />
          <Divider style={{ borderColor: "black", fontSize: 12 }}>
            Or with
          </Divider>
          <Button
            className="w-full text-[12px] font-bold"
            color="default"
            variant="solid"
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
