export * from "angularjs-annotations/core/decorators"
export * from "angularjs-annotations/core/types"
export {Provider, provide} from "angularjs-annotations/core/provider"

export interface OnInit {
    ngOnInit(): void;
}

export interface OnDestroy {
    ngOnDestroy(): void;
}