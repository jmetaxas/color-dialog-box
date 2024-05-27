declare module '*.css' {
    const stylesheet: CSSStyleSheet;
    export default stylesheet;
}

declare module '*?raw' {
    const content: string;
    export default content;
}