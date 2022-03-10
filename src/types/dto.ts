export interface LibraryDTO {
    id?: number;
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
    authorName: string | null;
    recordType: string;
    found: string;
    dateAdded: Date;
    
    addedById: number;
    libraryId: number;
    formatId: number;

    libraryName?: string;
    formatName?: string;
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

export interface RecordFilterDTO {
    startDate?: string;
    endDate?: string;
    userId?: number;
    libraryId?: number;
}