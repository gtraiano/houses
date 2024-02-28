import { Router, Request, Response } from "express";
import db from "../../db";
import { HousesResponseItem } from "../../../../types";

const route = Router();

route.get('/', (req: Request, res: Response ) => {
    try {
        const entries = Object.entries(req.query);
        // single query parameter (ok)
        if(entries.length === 1) {
            const [key, text] = entries[0];
            const results = db.query({ key: key as unknown as keyof HousesResponseItem, text: text as unknown as string });
            res.json(results);
        }
        // multiple parameters (no implementation yet)
        else {
            throw Error('Only queries with a single parameter are allowed');
        }
    }
    catch(e: any) {
        res.status(400).json({ error: e.message });
    }
});

export default route;