import { Locale } from "./locale";

export interface Project {
    name: string;
    description: string;
    baseLocale: string;
    locales: Locale[];
}
