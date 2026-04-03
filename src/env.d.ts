/// <reference types="astro/client" />

declare module "*.astro" {
    const AstroComponent: (props: Record<string, unknown>) => unknown;
    export default AstroComponent;
}
