let worker = null;
export async function start() {
    const {currentPatch} = document.querySelector("#main");
    if (currentPatch)
        await currentPatch.finished;
    const root = document.querySelector("#slow-updating-list");
    if (!root)
        return;
    const form = root.querySelector("form#filter");
    async function update() {
        if (worker)
            worker.terminate();
        const data = new FormData(form);
        const stream = root.querySelector(".list").patchSelf();
        const filter = data.get("filter");
        if (data.get("source") === "worker") {
            worker = new Worker(new URL("worker.js", import.meta.url));
            worker.postMessage({
                filter, stream}, {transfer: [stream]});
        } else {
            const response = await fetch(`/countries?filter=${filter}`);
            response.body.pipeTo(stream);
        }
    }
    root.querySelector("input[name=filter]").addEventListener("input", () => {
        update();
    });
    form.addEventListener("change", () => update());
    update();
}

export function stop() {
    if (worker)
        worker.terminate();
    worker = null;
}
