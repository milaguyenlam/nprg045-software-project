import * as SecureStore from "expo-secure-store";

const tokenKey = "JWT";

export async function saveToken(token: string) {
    await SecureStore.setItemAsync(tokenKey, token);
}

export async function getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(tokenKey);
}

export async function deleteToken() {
    await SecureStore.deleteItemAsync(tokenKey);
}

