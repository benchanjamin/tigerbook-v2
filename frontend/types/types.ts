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
    profile_pic: string | null;
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

export interface List {
    count: number,
    next: string | null,
    previous: string,
    results: ListUser[]
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
    username: string;
    full_name: string;
    track: string;
    concentration: string;
    class_year: number;
    residential_college: string;
    pronouns: null | string
    profile_pic_url: null | string;
    aliases: string[];
    certificates: string[];
    hometown: null | string;
    current_city: null | string;
    interests: null | string[];
    housing: null | string;
    extracurriculars: null | Extracurricular[];
    research: null | Research[];
    miscellaneous: null | Miscellaneous[];
    last_updated_current_city: null | string;
}

export interface HeaderType {
    username: string;
    profile_pic_url: string | null;

    has_profile: boolean;
}

export interface TigerBookMap {
    complete_city: string;
    count: number;
    latitude: number;
    longitude: number;
}

export interface FullProfileEditPost {
    permissions: Permissions | undefined;
    profile_pic: null;
    track: string;
    concentration: string;
    residential_college: string;
    housing: null;
    aliases: string[];
    pronouns: string | null;
    certificates: string[];
    hometown: string | null;
    current_city: string | null;
    interests: string[];
    extracurriculars: null | Extracurricular[]
    research: null;
    miscellaneous: null | Miscellaneous[];
}

export interface FullProfileEditGet {
    username: string;
    active_directory_entry: ActiveDirectoryEntry;
    residential_college_facebook_entry: ResidentialCollegeFacebookEntry;
    permissions: Permissions;
    profile_pic: null;
    track: string;
    concentration: string;
    class_year: number;
    residential_college: string;
    housing: null;
    aliases: string[];
    pronouns: string | null;
    certificates: string[];
    hometown: string | null;
    current_city: null;
    interests: string[];
    extracurriculars: null | Extracurricular[];
    research: null | Research[];
    miscellaneous: null | Miscellaneous[];
}


export interface Permissions {
    is_visible_to_undergrads: boolean;
    is_visible_to_faculty: boolean;
    is_visible_to_service_accounts: boolean;
    is_visible_to_graduate_students: boolean;
    is_visible_to_staff: boolean;
    username_prohibited_usernames: string[];
    profile_pic_prohibited_usernames: string[];
    track_prohibited_usernames: string[];
    concentration_prohibited_usernames: string[];
    class_year_prohibited_usernames: string[];
    residential_college_prohibited_usernames: string[];
    housing_prohibited_usernames: string[];
    aliases_prohibited_usernames: string[];
    pronouns_prohibited_usernames: string[];
    certificates_prohibited_usernames: string[];
    hometown_prohibited_usernames: string[];
    current_city_prohibited_usernames: string[];
    interests_prohibited_usernames: string[];
    extracurriculars_prohibited_usernames: string[];
    research_prohibited_usernames: string[];
    miscellaneous_prohibited_usernames: string[];
}

export interface ActiveDirectoryEntry {
    full_name: string;
    email: string;
}

export interface ResidentialCollegeFacebookEntry {
    photo_url: string;
}

export interface Extracurricular {
    extracurricular: string;
    positions: string[];
}

export interface Miscellaneous {
    miscellaneous_title: string;
    miscellaneous_description: string;
}

export interface Research {
    research_type: string;
    research_title: string;
}
