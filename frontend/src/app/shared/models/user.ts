import { Role } from './role';
import { Item } from './item';

export class User implements Item {
    id: any;
    name: string;
    username:string;
    email: string;
    roles?: Array<Role>;
    jwtToken?: string; // Optional
    appName?: string; // Optional


    constructor(
        id: any,
        username: string,
        email: string,
        roles?: Array<Role>,
        jwtToken?: string,
    ) {
        this.id = id;
        this.name = username;
        this.username = username;
        this.email = email;
        this.roles = roles;
        this.jwtToken = jwtToken;
    }
}
