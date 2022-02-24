export interface LibraryDTO {
    id?: number;
    code: string;
    name: string;
}

export interface UserDTO {
    id?: number;
    username: string;
    password?: string;
    role: number;
    token?: string;
}

export interface FormatDTO {
    id: number;
    name: string;
}

export interface TagDTO {
    id: number;
    name: string;
}
export interface RecordDTO {
    id?: number;
    number: number;
    authorName?: string;
    isAuthority: boolean;
    englishUNI: boolean;
    fly: boolean;
    recordType: string;
    found: string;

    dateAdded: Date;

    addedById: number;
    formatId: number;
    libraryId: number;
}

export interface NonCompliancesDTO {
    id?: number;
    recordId: number;
    userId: number;
    libraryId: number;
    formatId: number;
    tagId: number;
    language: string;
    description: string;
    group: string;
    dateAdded?: Date;

    recordNumber?: number;
    libraryName?: string;
    formatName?: string;
    tagName?: string;
}