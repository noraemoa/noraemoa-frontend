import { api } from "../../../shared/api/client";
import type { UserTasteProfileCreateRequest } from "../../../types/profile";

export async function addTasteProfile(
  balanceAnswer: UserTasteProfileCreateRequest,
) {
  try {
    const response = await api.post(`/users/me/taste-profile`, balanceAnswer);
    return response.data;
  } catch (error) {
    console.error("Error: " + error);
    throw error;
  }
}
