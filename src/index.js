const Stream = require("most");
const { T, cond, equals, map, path, reduce } = require("ramda");

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
    intents: [
        {
            type: "intent/INCREMENT",
            handle: emit => intent => Stream.from([
                emit("fact/INCREMENTED"),
            ]),
        },
    ],
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

const DomDriver = ({ intl }) => {
    const KeyedButton = Keyed(button, "some-key");
    return model => [
        [SimpleLabel, { label: "Custom label" }],
        [KeyedButton, { onClick: handleIncrement },
            intl.translate("main.clicked.label", model.counter),
            //`Clicked ${model.counter} times`,
        ],
    ];
};

render({ intl: key => key }, [Main, DomDriver], document.body);
