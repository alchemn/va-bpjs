import fs from "fs";
import path from "path";

type Context = {
    [key: string]: {
        [key: string]: {
            title: string;
            description: string;
            icon: string;
            questions: { q: string; a: string }[];
        };
    };
};

let cachedContext: Context | null = null;

export function loadContext(): Context {
    if (cachedContext) return cachedContext;

    const filePath = path.join(process.cwd(), "public", "context.json");

    try {
        const file = fs.readFileSync(filePath, "utf-8");
        cachedContext = JSON.parse(file) as Context;
        return cachedContext;
    } catch (error) {
        console.error("Context.json tidak bisa di baca", error);
        throw new Error("Context Tidak Ditemukan");
    }
}
