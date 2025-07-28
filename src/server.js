import express from "express"
import body_parser from "body-parser"
import path from "path"
import { readFileSync, readdirSync } from "fs";
const { json, urlencoded } = body_parser;
const app = express();
const {dirname} = import.meta;
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(express.static(path.resolve(dirname, "public")))

function demo_from_req(req) {
    const referer = new URL(req.headers.referer);
    const demo = /\/demo\/(.*)/.exec(referer)[1];
    return demo;
}

app.get("/demo-content/", (req, res) => {
    const demo = demo_from_req(req);
    res.sendFile(path.resolve(dirname, "public", "demos", demo, "index.html"))
})

app.get("/demo-options/", (req, res) => {
    const current = demo_from_req(req);
    const folders = readdirSync(path.resolve(dirname, "public/demos"));
    res.send(folders.map(f => `<option ${f === current ? "selected" : "" }>${f}</option>`).join(""));
})

app.get("/title/", (req, res) => {
    const demo = demo_from_req(req);
    res.send(`Patch demos - ${demo}`);
})

app.get("/countries", async (req, res) => {
    const countries = JSON.parse(readFileSync(path.resolve(dirname, "./public/demos/list/countries.json"), "utf-8"));
    const filter = req.query["filter"] || "";
    const filtered_countries = filter === "" ? countries :  countries.filter(({name}) => name.toLowerCase().includes(filter.toLowerCase()));
    res.writeHead(200);
    for (const {name} of filtered_countries) {
        res.write(`<li>${name}</li>`);
        await new Promise(resolve => {
            setTimeout(resolve, 1000);
        });
    }
    res.end();
});

app.get("/live-stream/", async (req, res) => {
    res.writeHead(200);
    for (let i = 0; ; ++i) {
        const target = `s${(i % 3) + 1}`;
        const value = parseInt(Math.random() * 100);
        res.write(`<template patchfor=${target}><output>${value}</output></template>`);
        await new Promise(resolve => {
            setTimeout(resolve, 400);
        });
    }
});

app.get("/demo/:demo", async (req, res) => {
    res.sendFile(path.resolve(dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
// Routes
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})