export * from "angularjs-annotations/core/decorators"
export * from "angularjs-annotations/core/types"

export interface OnInit {
    ngOnInit(): void;
}

export interface OnDestroy {
    ngOnDestroy(): void;
}