export interface WorkspaceDTO {
    name: string;
    similarityThreshold: number;
    openAiTemp: number;
    openAiHistory: number;
    openAiPrompt: string;
    queryRefusalResponse: string;
    chatMode: string;
    topN: number;  
}

export interface WorkspaceDTOresponse {
    id: string;
    name: string;
    slug: string;
    vectorTag: string | null;
    createdAt: string;
    openAiTemp: number;
    openAiHistory: number;
    lastUpdatedAt: string;
    openAiPrompt: string;
    similarityThreshold: number;
    chatProvider: string | null;
    chatModel: string | null;
    topN: number;
    chatMode: string;
    pfpFilename: string | null;
    agentProvider: string | null;
    agentModel: string | null;
    queryRefusalResponse: string;
    vectorSearchMode: string;
}

export interface WorkspaceResponseWithMessageDTO {
    workspace: WorkspaceDTOresponse
    message: string;
}

export interface WorkspaceResponseDTOList {
    workspaces: {
        id: string;
        name: string;
        slug: string;
        createdAt: string;
        openAiTemp: number | null;
        lastUpdatedAt: string;
        openAiHistory: number;
        openAiPrompt: string | null;
        documents: any[]; // Assuming documents are not yet defined, replace 'any' with the correct type if available
        threads: any[]; // Assuming threads are not yet defined, replace 'any' with the correct type if available
    }[];
}
