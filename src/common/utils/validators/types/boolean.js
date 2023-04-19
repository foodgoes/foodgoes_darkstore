import {setOutputOption} from '../utils';

export default (value, options={}) => {
    const {defaultValue=false} = options;
    let outputValue = value;
    const errors = [];

    const require = setOutputOption(options.require, "can't be blank");

    try {
        const blank = [null, undefined];
        if (blank.includes(outputValue)) {
            outputValue = defaultValue;

            if (require[0]) {
                errors.push(require[1]);
            }
        }

        outputValue = Boolean(outputValue);
    } catch (e) {
        errors.push("should be boolean");
    } finally {
        return [errors, outputValue];
    }
};