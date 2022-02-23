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

export interface RecordTypeDTO {
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
    libraryId: number;
    typeId: number;
    authorName?: string;
    fly: boolean;
    recordType: string;
    addedById: number;
    dateAdded: Date;
}

export interface NonCompliancesDTO {
    id?: number;
    recordId: number;
    userId: number;
    language: string;
    libraryId: number;
    recordTypeId: number;
    tagId: number;
    description: string;
    group: string;
    dateAdded?: Date;
}