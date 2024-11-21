import { Locale } from "./locale";

export interface Project {
    _id: string;
    name: string;
    description: string;
    baseLocale: string;
    locales: Locale[];
}
