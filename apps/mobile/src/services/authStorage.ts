import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "kolo_auth_token";

export async function setAuthToken(token: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getAuthToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}
