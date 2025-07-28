self.addEventListener("message", async message => {
    const {stream, filter} = message.data;
    const writer = stream.getWriter();
    const countries = await (await fetch("countries.json")).json();
    const filtered_countries = filter === "" ? countries :  countries.filter(({name}) => name.toLowerCase().includes(filter.toLowerCase()));
    for (const {name} of filtered_countries) {
        await new Promise(resolve => {
            writer.write(`<li>${name}</li>`);
            setTimeout(resolve, 1000);
        });
    }
    writer.close();
});

