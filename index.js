#!/usr/bin/env node

import {optimize} from "svgo";
import {readFile as readFileAsync, writeFile as writeFileAsync} from 'node:fs/promises';
import {Buffer} from 'node:buffer';
import sharp from "sharp";

// read data and optimize SVG
const origin = await readFileAsync("src/bluesky-icon.svg", "utf8");
const svg = optimize(origin, {
    path: "src/bluesky-icon.svg",
    multipass: true,
});

const bluesky = {
    black: svg.data, // default color variant is black
    white: svg.data.replace('fill="currentColor"', 'fill="#fff"'),
    blue: svg.data.replace('fill="currentColor"', 'fill="#0560ff"'),
}


// export all variants
for (const [variant, src] of Object.entries(bluesky)) {
    const icon = await sharp(Buffer.from(src));

    if (variant === "black") {
        await writeFileAsync("dist/bluesky-icon.svg", src)
        await icon.toFile("dist/bluesky-icon.png");
        await icon.toFile("dist/bluesky-icon.webp");
    } else {
        await writeFileAsync(`dist/bluesky-icon.${variant}.svg`, src)
        await icon.toFile(`dist/bluesky-icon.${variant}.png`);
        await icon.toFile(`dist/bluesky-icon.${variant}.webp`);
    }

}

console.log("Done!");
