const Stream = require("most");
const { T, cond, equals, path } = require("ramda");

const { assemble } = require("arch-one");
const { Keyed, button, div, render } = require("arch-one/dom");

const handleIncrement = emit => model => evt => (
    emit("intent/INCREMENT")
);

const handleSomething = emit => model => evt => (
    emit("intent/DO_SOMETHING")
);

const SimpleLabel = plugins => ({ label = `Some label` }) => [
    [div, { onClick: handleSomething }, label],
];

const Main = plugins => ({
    interpret: {
        "intent/INCREMENT": emit => intent => Stream.from([
            emit("fact/INCREMENTED"),
        ]),
    },
    //process: spawnFact => spawnIntent => fact => Stream.from([
    //]),
    replay: (model = { counter: 0 }) => cond([
        [equals("fact/INCREMENTED"), {
            ...model,
            counter: model.counter + 1,
        }],
        [T, model],
    ]),
});

const DomDriver = plugins => decoratee => {
    const KeyedButton = Keyed(button, "some-key");
    decoratee.materialize = model => [
        [SimpleLabel, { label: "Custom label" }],
        [KeyedButton, { onClick: handleIncrement },
         `Clicked ${model.counter} times`,
        ],
    ];
    return decoratee;
};

render(assemble(Main, DomDriver), document.body);
