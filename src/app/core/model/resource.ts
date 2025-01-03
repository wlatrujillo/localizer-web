import { Translation } from "./translation";

export interface Resource {
    projectId: string;
    code: string;
    translations: Translation[]
}
