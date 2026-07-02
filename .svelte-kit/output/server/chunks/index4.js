var p = { 0: 8203, 1: 8204, 2: 8205, 3: 8290, 4: 8291, 5: 8288, 6: 65279, 7: 8289, 8: 119155, 9: 119156, a: 119157, b: 119158, c: 119159, d: 119160, e: 119161, f: 119162 }, l = { 0: 8203, 1: 8204, 2: 8205, 3: 65279 }, d = { 0: String.fromCodePoint(l[0]), 1: String.fromCodePoint(l[1]), 2: String.fromCodePoint(l[2]), 3: String.fromCodePoint(l[3]) };
new Array(4).fill(String.fromCodePoint(l[0])).join("");
Object.fromEntries(Object.entries(d).map((e) => [e[1], +e[0]]));
Object.fromEntries(Object.entries(p).map((e) => e.reverse()));
`${Object.values(p).map((e) => `\\u{${e.toString(16)}}`).join("")}`;
