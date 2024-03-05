import { HousesAPIResponse } from "../../../../types";

export const fetchHouses = async (): Promise<HousesAPIResponse> => {
    const url = new URL(process.env.REMOTE_API_URL as string + '/houses');
    const response = await fetch(url);
    return await response.json() as HousesAPIResponse;
}