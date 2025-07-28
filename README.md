# patch-demos
A few demos for the document patching feature described [here](https://github.com/WICG/declarative-partial-updates?tab=readme-ov-file#part-1-patching-out-of-order-streaming).

This is a very early state of the feature, and requires Chrome Canary (>140.0.7322.0) and the "Document patching" flag turned on (chrome://flags/#document-patching).

## The patching feature

Patching allows streaming HTML content into existing DOM.

This is how it works in a nutshell.

This would stream the HTML "Content" into an element with ID "target":
```html
<template patchfor=target>Content</template>`
```

This would stream the HTML found in "content.html" into an element with an ID "target":
```html
<template patchfor=target patchsrc="content.html">Content</template>
```

This would apply a certain style only while patching:
```css
#target:patching {
    background: yellow;
}
```

This would retrieve the status of an existing patch, and would allow waiting until it is done:
```js
const patch = element.currentPatch;
if (patch) {
    await patch.finished;
}
```

This creates a writable stream, to stream a patch into:
```js
const writable = target_element.patchSelf();
some_stream_including_single_patch.pipeTo(writable);
```

This creates a writable stream, to stream an HTML that contains patches and apply only the patches (wrapped in `<template patchfor>`):
```js
const writable = document_or_scope_element_or_shadow_root.patchAll();
some_stream_including_multiple_patches.pipeTo(writable);
```

## Running the demos
Download the code, and follow the standard node process:
```bash
# Make sure you have node 22 installed
nvm use
npm i
npm start
```

Then load `http://localhost:3000`.

## The demos

### The app itself
The whole shell of this demo is written using patches.
It outputs the shell first, and then loads content into it via `<template patchsrc>` elements.

Then, when a demo is selected, it calls `patchAll` and patches the existing document instead of reloading it.

Note that not only the main content is patched, but also the list of demos and the title.

### Slow loading list

This shows how to patch a particular element using `patchSelf`.
The country list simulates a slow-loading list.
We can either stream it from a dedicated worker, by transferring the writable to the worker (or performing other stream operations),
or from the server by writing into a response in the server.

### Live stream

This shows how to update an element from a continuous stream of patches that optionally never closes.
The root element has an open `patchAll` to it, and the server continuously sends `<template patchfor>` clauses that update its contents.
