export * from "angularjs-annotations/core/decorators"
export * from "angularjs-annotations/core/types"

interface OnInit {
    ngOnInit(): void;
}
interface OnDestroy {
    ngOnDestroy(): void;
}

export {OnInit, OnDestroy}