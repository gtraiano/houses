export type HousesResponse = HousesResponseItem[];

export interface HousesResponseItem {
    id: string,
    name: string,
    houseColors: string,
    founder: string,
    animal: string,
    element: string,
    ghost: string,
    commonRoom: string,
    heads: Array<Head>,
    traits: Array<Trait>
}

export interface Head {
    id: string,
    firstName: string,
    lastName: string
}

export interface Trait {
    id: string,
    trait: string
}