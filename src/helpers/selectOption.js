export const SelectOption = function(options) {
    const newOptions = [];
    for (let i = 0; i < options.length; i++) {
        newOptions.push({value: options[i].id, label: (options[i].name)});
    }
    return newOptions;
};