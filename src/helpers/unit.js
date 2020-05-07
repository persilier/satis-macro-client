export const formatUnits = (listUnits) => {
    const newListUnits = [];
    for (let i = 0; i<listUnits.length; i++)
        newListUnits.push({id: listUnits[i].id, name: listUnits[i].name});
    return newListUnits;
};
