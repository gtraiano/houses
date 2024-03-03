import styles from './style.module.css';
import { HousesAPIResponseItem } from "../../../../types";
import { CSSProperties, useEffect, useState } from 'react';

interface HouseCardProps {
    house: HousesAPIResponseItem
}

export default function HouseCard({ house }: HouseCardProps) {    
    const [gradient, setGradient] = useState<CSSProperties>();
    
    useEffect(() => {
        const [from, to] = house.houseColours.split(' and ').map(c => c.toLowerCase());
        setGradient({ backgroundImage: `linear-gradient(to right, ${from}, ${to})` });
    }, []);
    
    if(!house) return null;
    return (
        <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white">
            <div className="p-4">
                <div className="flex flex-row justify-between items-baseline mb-3">
                    <h2 className="font-bold text-xl">{house.name}</h2>
                    <span>{house.animal}</span>
                </div>
                <div
                    style={gradient}
                    className={`mb-3 rounded ${styles['gradient']} ${styles['gradient-fallback']}`}
                />
                <div className="text-gray-700 text-base">
                    <span>Founder:</span>&nbsp;<span className="font-bold text-l">{house.founder}</span>
                </div>
            </div>
        </div>
    )
}