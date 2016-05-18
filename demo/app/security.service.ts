import { Injectable, Inject } from "angularjs-annotations/core";

@Injectable()
export class SecurityService {
    isAuthorized: boolean;
    isAdmin: boolean;
    
    login() {
        this.isAuthorized = true;
    }
    
    logout() {
        this.isAuthorized = false;
    }
}