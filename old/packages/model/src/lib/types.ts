import {RemoteWithRefs} from "simple-git";

export interface Metadata {
    packageJson?: any;
    git?: GitMetadata;
    readme?: boolean,
    urls?: string[],
    accessibilityTrees?: {
        [key: string]: any
    }
    auditor?: {
        name: string;
        email: string;
    },
    projectName?: string;
}

export interface GitMetadata {
    remotes?: RemoteWithRefs[]
}

export type AsyncAuditFunction = (inquirer: any) => Promise<AuditResult | boolean>
export type AuditFunction = (page: any, metadata: Metadata) => Promise<AuditResult | boolean>;
export type RuleConfig = { categories: string[]};

export interface AuditResult {
    name?: string;
    message?: string;
    payload?: any;
    links?: string[]
}

export interface Result {
    ecoIndex: {
        pages: {
            ecoIndex: number;
            grade: string;
            greenhouseGasesEmission: number;
            waterConsumption: number;
        }[];
        ecoIndex: number;
        grade: string;
        greenhouseGasesEmission: number;
        waterConsumption: number;
    };
    audits: { [key: string]: { [key: string]: AuditResult } };
    biggestRequest: { url: string; size: number }[];
}
