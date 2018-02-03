const Stream = require("most");
const { T, cond, equals, path } = require("ramda");

const { assemble } = require("arch-one");
const { button, div, render } = require("arch-one/dom");

const increment = {
    given: equals("intent/INCREMENT"),
    then: emit => intent => Stream.from([
        emit("fact/INCREMENTED"),
    ]),
};

const handleIncrement = emit => model => evt => (
    emit("intent/INCREMENT")
);

const handleSomething = emit => model => evt => (
    emit("intent/DO_SOMETHING")
);

const SimpleLabel = ({ label = `Some label` }) => [
    [div, { onClick: handleSomething }, label],
];

const Program = {
    interpret: [
        increment,
    ],
    materialize: model => [
        [SimpleLabel, { label: "Custom label" }],
        [button.keyed("some-key"), { onClick: handleIncrement },
            `Clicked ${model.counter} times`,
        ],
    ],
    //process: spawnFact => spawnIntent => fact => Stream.from([
    //]),
    replay: (model = { counter: 0 }) => cond([
        [equals("fact/INCREMENTED"), {
            ...model,
            counter: model.counter + 1,
        }],
        [T, {...model}],
    ]),
};

render(Program, document.body);
