//@ts-nocheck

export const descending_comparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export const get_comparator = (order, orderBy) => {
    return order === 'desc'
        ? (a, b) => descending_comparator(a, b, orderBy)
        : (a, b) => -descending_comparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly

export const stable_sort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });

    return stabilizedThis.map((el) => el[0]);
}