import { Router, Request, Response } from "express";
import db from "../../db";
import { HousesResponseItem, HousesDBQuery } from "../../../../types";

const route = Router();

route.get('/', (req: Request, res: Response ) => {
    try {
        const params = Object.entries(req.query);
        let query = null as unknown as HousesDBQuery;

        // multiple parameters (no implementation yet)
        if(params.length > 1) throw Error('Only queries with a single parameter are allowed');
        // get parameter and value (or null for both if it does not exist)
        const [key, text] = params[0] ?? [null, null];
        // update query object
        query = { key: key as unknown as keyof HousesResponseItem, text: text as unknown as string };
        const results = db.query(query);
        res.json(results);
    }
    catch(e: any) {
        console.log(e);
        res.status(400).json({ error: e.message });
    }
});

route.get('/querykeys', (req: Request, res: Response) => {
    res.json(db.validQueryKeys);
});

export default route;