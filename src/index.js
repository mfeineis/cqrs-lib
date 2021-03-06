const { T, cond, equals, map, path, reduce } = require("ramda");

const { assemble } = require("arch-one");
const { SyncListAdapter, bindAdapter } = require("arch-one/process");
const { Keyed, button, div, input, label, render } = require("arch-one/dom");

const intents = {
    INCREMENT: "intent/INCREMENT",
    DO_SOMETHING: "intent/DO_SOMETHING",
};

const facts = {
    INCREMENTED: "fact/INCREMENTED",
};

const handleIncrement = emit => model => evt => (
    emit(intents.INCREMENT)
);

const handleSomething = emit => model => evt => (
    emit(intents.DO_SOMETHING, { some: "data" })
);

const MainReadSide = (model = { checked: false, counter: 0 }) => cond([
    [equals(facts.INCREMENTED), {
        ...model,
        counter: model.counter + 1,
    }],
    [T, model],
]);

const MainWriteLogic = () => ({
    handleIntents: [
        [intents.INCREMENT, emit => intent => [
            emit(facts.INCREMENTED),
        ]],
    ],
    processFacts: stateFact => queueIntent => fact => [
    ],
});
const MainWriteSide = bindAdapter(SyncListAdapter, MainWriteLogic);

const Checkbox = ({ checked = false }, children) => [
    [label, { onClick: handleSomething },
     [input, { checked }], ...children
    ],
];

const MainView = (model, children) => {
    const KeyedButton = Keyed(button, "some-key");
    return [
        [Checkbox, `Custom label ${model.checked ? "(checked)" : ""}`
        ],
        [KeyedButton, { onClick: handleIncrement },
          intl.translate("main.clicked.label", model.counter),
        ],
        ...children,
    ];
};

const Main = assemble(MainView, MainReadSide, MainWriteSide);

render(document.body, Main, /*props:*/null, /*plugins:*/{ intl: key => key });
