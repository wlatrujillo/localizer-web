import { Translation } from "./translation";

export interface Resource {
    projectId: string;
    code: string;
    value: string;
    translations: Translation[]
}
