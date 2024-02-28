import { HousesResponse } from "../../../../types";

export const fetchHouses = async (): Promise<HousesResponse> => {
    const response = await fetch(process.env.BACKEND_FALLBACK_URL as string);
    return await response.json() as HousesResponse;
}