import SyntaxCodeComponent from "./SyntaxCode.astro";

export { SyntaxCodeComponent as syntaxCode, SyntaxCodeComponent as SyntaxCode };

export const blockComponents = {
	syntaxCode: SyntaxCodeComponent,
} as const;
