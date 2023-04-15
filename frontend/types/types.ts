export interface Tokens {
    refresh: string;
    access:  string;
}



export interface JWTDecode {
    token_type: string;
    exp:        number;
    iat:        number;
    jti:        string;
    user_id:    number;
}
