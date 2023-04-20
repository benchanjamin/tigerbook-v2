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
    residential_college_facebook_entry: ResidentialCollegeFacebookEntry | null;
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

export interface ListData {
    count: number;
    next: null | string
    previous: null | string;
    results: ListUser[];
}

export interface ListUser {
    username: string;
    full_name: string;
    track: string;
    concentration: string;
    class_year: number;
    residential_college: string;
    pronouns: string | null;
    profile_pic_url: string;
    url: string;
}

export interface User {
    username:            string;
    full_name:           string;
    track:               string;
    concentration:       string;
    class_year:          number;
    residential_college: string;
    pronouns:            null | string
    profile_pic_url:     null | string;
    aliases:             string[];
    certificates:        string[];
    hometown:            null | string;
}

export interface HeaderType {
    username: string;
    profile_pic_url: string | null;
}

export interface TigerBookMap {
    complete_city: string;
    count:         number;
    latitude:      number;
    longitude:     number;
}

