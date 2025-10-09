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
      dob: "2001-01-01",
      phone: "5555555555",
      email: email,
      password: password,
      address: {
        street: "101 Testing Way",
        city: "New York",
        state: "New York",
        country: "US",
        postal_code: "55555",
      },
    },
  });

  expect(response.status()).toBe(201);
  return response.status();
}