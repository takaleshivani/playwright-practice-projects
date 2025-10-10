import {expect,request} from "@playwright/test";
import * as fs from 'fs';

export async function createMessageFromContactForm(
    name: string,
    message: string,
    subject: string,
    authFilePath: string
) {

    const authData = JSON.parse(fs.readFileSync(authFilePath, 'utf-8'));
    const token = authData.origins[0].localStorage.find(
    (item) => item.name === "auth-token"
  ).value;

    const apiUrl = process.env.API_URL;
    const createRequestContext = await request.newContext();
    const response = await createRequestContext.post(apiUrl + "/messages", {
    data: {
      name: name,
      message: message,
      subject: subject,
    },
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  expect(response.status()).toBe(200);
  return await response.json();
}