import {useState} from "react";
import {Button, Divider, Form, Input, message} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {fetchToken} from "../../api/auth/Login.ts";
import "../../../public/assets/css/Login.css";
import {useAuth} from "../../hook/UseAuth.ts";

function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [
        showIncorrectEmailPasswordMessage,
        setShowIncorrectEmailPasswordMessage,
    ] = useState<boolean>(false);
    const navigate = useNavigate();
    const {login} = useAuth()

    const handleOnChangeEmail = (e: string) => {
        setEmail(e);
    };

    const handleOnChangePassword = (e: string) => {
        setPassword(e);
    };

    const receivedToken = async (email: string, password: string) => {
        try {
            const tokenObject = await fetchToken(email, password);
            login(tokenObject.access_token);
            navigate("/");
        } catch (err: any) {
            if (err.response) {
                const errorMessage = err.response.data?.error?.toLowerCase() || "";

                if (
                    errorMessage.includes("does not exist") ||
                    errorMessage.includes("invalid password")
                ) {
                    setShowIncorrectEmailPasswordMessage(true);
                } else {
                    message.error("Login failed: " + err.response.data?.error || "Unknown server error");
                }
            } else if (err.request) {
                message.error("Network error: Could not reach server.");
            } else {
                message.error("Unexpected error: " + err.message);
            }
        }
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div
                className={`w-[280px] ${showIncorrectEmailPasswordMessage ? "h-[60vh]" : "h-[54vh]"} bg-[#E7E7E7] p-6 rounded-md`}>
                <p className="text-center text-lg font-bold mt-2 mb-6">Login</p>
                <div className="flex flex-col items-center space-y-5 mb-5">
                    <Form className="w-full">
                        <Form.Item
                            name="email"
                            rules={[{required: true, message: "Please input your email!"}]}
                        >
                            <Input
                                placeholder="Email"
                                style={{height: 30}}
                                className="w-full"
                                onClick={() => setShowIncorrectEmailPasswordMessage(false)}
                                onChange={(e) => handleOnChangeEmail(e.target.value)}
                                value={email}
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {required: true, message: "Please input your password!"},
                            ]}
                        >
                            <Input
                                placeholder="Password"
                                type="password"
                                style={{height: 30}}
                                className="w-full"
                                onClick={() => setShowIncorrectEmailPasswordMessage(false)}
                                onChange={(e) => handleOnChangePassword(e.target.value)}
                                value={password}
                            />
                        </Form.Item>
                        {showIncorrectEmailPasswordMessage && (
                            <div className="text-red-500">* Incorrect email or password</div>
                        )}
                        <Divider style={{borderColor: "black", fontSize: 12}}>
                            Or With
                        </Divider>
                        <Form.Item>
                            <Button
                                className="w-full text-[12px] font-bold"
                                color="default"
                                variant="solid"
                                onClick={async () => await receivedToken(email, password)}
                                htmlType="submit"
                            >
                                Login
                            </Button>
                        </Form.Item>
                        <p className="text-center text-xs ">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="underline underline-offset-1 text-[#0087E7]"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default Login;
