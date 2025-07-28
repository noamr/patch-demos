async function load_demo_script(name) {
    const module = await import(`/demos/${name}/index.js`);
    module.start();
}
(async function() {
    if (!("currentPatch" in Element.prototype)) 
        return;

    const match = new URLPattern({pathname: "/demo/:demo"}).exec(location.href);
    if (!match)
        location.href = "/demo/list";

   load_demo_script(match.pathname.groups.demo);

    document.documentElement.classList.add("patching-supported");
    document.querySelector("#demo-select").addEventListener("change", async e => {
        const demo = e.target.value;
        history.replaceState(0, 0, `/demo/${demo}`);
        const response = await fetch(`/demo/${demo}`);
        response.body.pipeTo(document.patchAll());
        load_demo_script(demo);
    })
})();
