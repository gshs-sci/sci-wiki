import remarkRehype from "remark-rehype";
import { unified } from "unified";
import remarkParse from "remark-parse";
import rehypeReact from "rehype-react";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import { remarkExtendedTable, extendedTableHandlers } from 'remark-extended-table';

import rehypeSanitize from "rehype-sanitize";
import GithubSlugger from 'github-slugger'
import Link from "next/link";

import "./globals.css"
import * as prod from 'react/jsx-runtime'
import { BiMenu } from "react-icons/bi";
import { Index } from "@/app/components/doc/index/index";
import { H2Elem, H3Elem, H4Elem, H5Elem, H6Elem } from "@/app/components/doc/titles";

interface Title {
    level: number
    text: string
    id: string
    children: Array<Title>
}
const extractTitles = (markdownText: string) => {
    const lines = markdownText.split('\n');
    const titles: Array<Title> = [];
    const slugger = new GithubSlugger();
    let insideCodeBlock = false;
    let insideMathBlock = false;
    const parentIndexes = [0, 0, 0, 0, 0];

    const extractTitle = (level: number, match: RegExpMatchArray) => {
        const title = {
            level,
            text: match[1],
            id: slugger.slug(match[1]),
            children: [],
        };

        let parent = titles;
        for (let i = 1; i < level; i++) {
            const parentIndex = parentIndexes[i - 1];
            parent = parent[parentIndex].children;
        }
        parent.push(title);
        parentIndexes[level - 1] = parent.length - 1;
    };

    for (const line of lines) {
        if (line.startsWith('```')) {
            insideCodeBlock = !insideCodeBlock;
            continue;
        }
        if (line.startsWith('$$')) {
            insideMathBlock = !insideMathBlock;
            continue;
        }

        if (!insideCodeBlock && !insideMathBlock) {
            const levelMatches = [
                line.match(/^##\s(.+)/),
                line.match(/^###\s(.+)/),
                line.match(/^####\s(.+)/),
                line.match(/^#####\s(.+)/),
                line.match(/^######\s(.+)/),
            ];

            for (let level = 1; level <= levelMatches.length; level++) {
                const match = levelMatches[level - 1];
                if (match) {
                    extractTitle(level, match);
                    break;
                }
            }
        }
    }

    return titles;
};

const CompileMD = (data: string): Promise<JSX.Element> => {

    const aElem = (prop: any) => {
        if (!prop["data-footnote-ref"]) {
            return (
                <a {...prop} >{prop.children}</a>
            )
        }
        return (
            <a {...prop} >[{prop.children}]</a>
        )
    }

    const options: any = {
        Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs, components: {
            h2: H2Elem, h3: H3Elem, h4: H4Elem, h5: H5Elem, h6: H6Elem, a: aElem
        }
    }

    return new Promise((resolve, _) => {
        unified()
            .use(remarkParse, { fragment: true })
            .use(remarkMath)
            .use(remarkGfm)
            .use(remarkExtendedTable)
            .use(remarkRehype, {
                handlers: {
                    ...extendedTableHandlers
                }
            })
            .use(rehypeHighlight)
            .use(rehypeSlug)
            .use(rehypeKatex)
            .use(rehypeReact, options)
            .process(data)
            .then((val) => {
                resolve(val.result)
            });
    })

}


export default async function Document() {

    const Data = `
## Lift
When a fluid flows around an object, the fluid exerts a force on the object. Lift is the component of this force that is perpendicular to the oncoming flow direction.[1] It contrasts with the drag force, which is the component of the force parallel to the flow direction. Lift conventionally acts in an upward direction in order to counter the force of gravity, but it is defined to act perpendicular to the flow and therefore can act in any direction.

If the surrounding fluid is air, the force is called an aerodynamic force. In water or any other liquid, it is called a hydrodynamic force.

Dynamic lift is distinguished from other kinds of lift in fluids. Aerostatic lift or buoyancy, in which an internal fluid is lighter than the surrounding fluid, does not require movement and is used by balloons, blimps, dirigibles, boats, and submarines. Planing lift, in which only the lower portion of the body is immersed in a liquid flow, is used by motorboats, surfboards, windsurfers, sailboats, and water-skis.

## test level 1
A fluid flowing around the surface of a solid object applies a force on it. It does not matter whether the object is moving through a stationary fluid (e.g. an aircraft flying through the air) or whether the object is stationary and the fluid is moving (e.g. a wing in a wind tunnel) or whether both are moving (e.g. a sailboat using the wind to move forward). Lift is the component of this force that is perpendicular to the oncoming flow direction.[1] Lift is always accompanied by a drag force, which is the component of the surface force parallel to the flow direction.

Lift is mostly associated with the wings of fixed-wing aircraft, although it is more widely generated by many other streamlined bodies such as propellers, kites, helicopter rotors, racing car wings, maritime sails, wind turbines, and by sailboat keels, ship's rudders, and hydrofoils in water. Lift is also used by flying and gliding animals, especially by birds, bats, and insects, and even in the plant world by the seeds of certain trees.[2] While the common meaning of the word "lift" assumes that lift opposes weight, lift can be in any direction with respect to gravity, since it is defined with respect to the direction of flow rather than to the direction of gravity. When an aircraft is cruising in straight and level flight, most of the lift opposes gravity.[3] However, when an aircraft is climbing, descending, or banking in a turn the lift is tilted with respect to the vertical.[4] Lift may also act as downforce in some aerobatic manoeuvres, or on the wing on a racing car. Lift may also be largely horizontal, for instance on a sailing ship.

The lift discussed in this article is mainly in relation to airfoils, although marine hydrofoils and propellers share the same physical principles and work in the same way, despite differences between air and water such as density, compressibility, and viscosity.

The flow around a lifting airfoil is a fluid mechanics phenomenon that can be understood on essentially two levels: There are mathematical theories, which are based on established laws of physics and represent the flow accurately, but which require solving partial differential equations. And there are physical explanations without math, which are less rigorous.[5] Correctly explaining lift in these qualitative terms is difficult because the cause-and-effect relationships involved are subtle.[6] A comprehensive explanation that captures all of the essential aspects is necessarily complex. There are also many simplified explanations, but all leave significant parts of the phenomenon unexplained, while some also have elements that are simply incorrect.[5][7][8][9][10][11]

### test level 2
Lift($$L$$) can be determined by Lift Coefficient ($$C_L$$) like the following equation. $$ L = \\frac{1}{2} \\rho v^2 S C_L $$


#### test level 3

## Autolink literals

www.example.com, https://example.com, and contact@example.com.

## dsadasd

https://www.youtube.com/watch?v=S9a3jPQVqAE

A note[^1] A note[^2]

[^1]: Big note. https://google.com
[^2]: Big note. https://google.com

## Strikethrough

~one~ or ~~two~~ tildes.

## Table

| header1          | header2          |
| ---------------- | ---------------- |
| cell (rowspan=2) | cell             |
| \\^                | cell             |
| \\>                | cell (colspan=2) |
| escape >         | \\>               |
| escape ^         | \\^               |


## Tasklist

* [ ] to do
* [x] done

## Conclusion
aa

`
    const compiled = await CompileMD(Data)
    return (
        <>
            <Index titles={extractTitles(Data)} />
            <div>{compiled}</div>
        </>
    )
}