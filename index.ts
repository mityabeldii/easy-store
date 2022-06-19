import _ from 'lodash';
import createEmitter from 'restore-emitter';

const createStorage = (store) => {
    const emitter = createEmitter();
    const storage = {
        get: (getter = (store) => store) => {
            return getter(store);
        },
        set: (setter = (store) => store) => {
            store = setter(store);
            emitter.trigger();
            return storage;
        },
        subscribe: (getter = (store) => store, callback = (store) => {}) => {
            let prevValue = getter(store);
            const handler = () => {
                const nextValue = getter(store);
                if (!_.isEqual(prevValue, nextValue)) {
                    prevValue = nextValue;
                    callback(nextValue);
                }
            };
            emitter.addListener(handler);
            return () => {
                emitter.removeListener(handler);
            };
        },
    };
    return storage;
};

export default createStorage;
