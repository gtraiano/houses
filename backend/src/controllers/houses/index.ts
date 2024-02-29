import { HousesResponse } from "../../../../types";

export const fetchHouses = async (): Promise<HousesResponse> => {
    const response = await fetch(process.env.REMOTE_API_URL as string);
    return await response.json() as HousesResponse;
}