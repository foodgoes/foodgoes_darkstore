import {setOutputOption} from '../utils';

export default (value, options={}, msg = {}) => {
    const {defaultValue=''} = options;
    let outputValue = value;
    const errors = [];

    const require = setOutputOption(options.require, "can't be blank");
    const max = setOutputOption(options.max, 'maximum is #value# characters');
    const min = setOutputOption(options.min, 'minimum is #value# characters');
    const regExp = setOutputOption(options.regExp, 'invalid regExp');
    const enumList = setOutputOption(options.enumList, 'is not included in the list');

    try {
        const blank = [null, undefined, ''];
        outputValue = (outputValue && typeof outputValue === 'string') ? outputValue.trim() : outputValue;

        if (blank.includes(outputValue)) {
            outputValue = defaultValue;

            if (require[0]) {
                errors.push(require[1]);
            }
        }

        outputValue = outputValue.toString();
        outputValue = outputValue.trim();

        if (max[0] && outputValue.length > max[0]) {
            errors.push(max[1]);
        }
        if (min[0] && outputValue.length < min[0]) {
            errors.push(min[1]);
        }
        if (regExp[0] && !regExp[0].test(outputValue)) {
            errors.push(regExp[1]);
        }
        if (enumList[0] && !enumList[0].includes(outputValue)) {
            errors.push(enumList[1]);
        }
    } catch (e) {
        errors.push("should be string");
    } finally {
        return [errors, outputValue];
    }
};