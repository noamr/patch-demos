class LiveStream extends HTMLElement {
    async connectedCallback() {
        const stream_url = this.getAttribute("src");
        (await fetch(stream_url)).body.pipeTo(this.patchAll());
    }
};
customElements.define("live-stream", LiveStream);

export function start() {}