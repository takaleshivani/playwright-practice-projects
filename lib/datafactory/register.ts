import { request, expect } from "@playwright/test";

export async function registerUser(email: string, password: string) {
  const apiUrl = process.env.API_URL;
  console.log("API URL:", apiUrl);
  if (!apiUrl) {
    throw new Error("API_URL environment variable is not set");
  }
  const createRequestContext = await request.newContext();
  const response = await createRequestContext.post(apiUrl + "/users/register", {
    data: {
      first_name: "Test",
      last_name: "User",
      dob: "1995-01-01",
      phone: "9242344522",
      email: email,
      password: password,
      address: {
        street: "Wakad",
        city: "Pune",
        state: "Maharashtra",
        country: "IN",
        postal_code: "411057",
      },
    },
  });

  expect(response.status()).toBe(201);
  return response.status();
}