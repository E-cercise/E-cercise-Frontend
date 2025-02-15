import axios from "axios";

export const signUp = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  address: string,
  phoneNumber: string
) => {
  try {
    const response = await axios.post(
      `${process.env.API_BASE_URL}/api/auth/register`,
      {
        "email": email,
        "password": password,
        "first_name": firstName,
        "last_name": lastName,
        "address": address,
        "phone_number": phoneNumber,
      },
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (err) {
    console.error(err);
  }
};
