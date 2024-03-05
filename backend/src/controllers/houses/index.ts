import { HousesAPIResponse } from "../../../../types";

const remoteAPI = (process.env.REMOTE_API_URL as string)?.trim() ?? 'https://wizard-world-api.herokuapp.com'

export const fetchHouses = async (): Promise<HousesAPIResponse> => {
    const url = new URL(remoteAPI + '/houses');
    const response = await fetch(url);
    return await response.json() as HousesAPIResponse;
}