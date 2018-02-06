const { render } = require("arch-one/dom");

const Hello = () => ({ who = "World" }) => () => [
    `Hello ${who}`,
];

render(document.body, Hello, { who: "Bob" });
