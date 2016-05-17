import { Injectable, Inject } from "angularjs-annotations/core";

@Injectable()
export class SecurityService {
    isAuthorized: boolean;
    isAdmin: boolean;
}