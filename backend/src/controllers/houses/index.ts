import { HousesAPIResponse } from "../../../../types";

export const fetchHouses = async (): Promise<HousesAPIResponse> => {
    const response = await fetch(process.env.REMOTE_API_URL as string);
    return await response.json() as HousesAPIResponse;
}