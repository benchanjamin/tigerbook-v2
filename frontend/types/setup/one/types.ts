type Nullable<T> = T | null;

export interface SetupOnePost {
    aliases: string[];
    concentration: string;
    track: string;
    pronouns: Nullable<string>;
    hometown: Nullable<string>;
    certificates: string[];
    residential_college: string;
    class_year: number;
}


export interface SetupOneGet {
    username: string;
    active_directory_entry: ActiveDirectoryEntry;
    residential_college_facebook_entry: ResidentialCollegeFacebookEntry;
    aliases: string[];
    concentration: string | null;
    track: string | null;
    pronouns: Nullable<string>;
    hometown: Nullable<string>;
    certificates: string[];
    class_year: number | null;
    residential_college: string | null;
    profile_pic: string;
}

export interface ActiveDirectoryEntry {
    full_name: string;
    email: string;
}

export interface ResidentialCollegeFacebookEntry {
    photo_url: string;
}

export interface SetupTwoGet {
    profile_pic: string;
    username: string;
}

export type SetupTwoPost = FormData
