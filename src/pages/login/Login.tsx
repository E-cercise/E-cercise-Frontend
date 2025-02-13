import React, { useState } from "react";
import { Button, Divider, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/Login";
import { AES }from "crypto-ts";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleOnChangeEmail = (e: string) => {
    setEmail(e);
  };

  const handleOnChangePassword = (e:string) => {
    setPassword(e);
  }

  const receivedToken = async (email: string, password: string) => {
    try {
      const encryptedEmail = AES.encrypt(email, JSON.stringify(process.env.SECRET_KEY)).toString();
      const encryptedPassword = AES.encrypt(password, JSON.stringify(process.env.SECRET_KEY)).toString();
      const tokenObject = await login(encryptedEmail, encryptedPassword);
      localStorage.setItem("accessToken", tokenObject.access_token);
      navigate("/home");
    } catch(err) {
      console.error(err);
      navigate("/login");
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[280px] h-[330px] bg-[#E7E7E7] p-6 rounded-md">
        <p className="text-center text-lg font-bold mt-2 mb-6">Login</p>
        <div className="flex flex-col items-center space-y-5 mb-5">
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
          <Divider style={{ borderColor: "black", fontSize: 12 }}>
            Or With
          </Divider>
          <Button
            className="w-full text-[12px] font-bold"
            color="default"
            variant="solid"
            onClick={async () => await receivedToken(email, password)}
          >
            Login
          </Button>
        </div>
        <p className="text-center text-xs ">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="underline underline-offset-1 text-[#0087E7]"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
