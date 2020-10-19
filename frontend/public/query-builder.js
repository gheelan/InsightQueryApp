/**
 * Builds a query string using the current document object model (DOM).
 * Must use the browser's global document object {@link https://developer.mozilla.org/en-US/docs/Web/API/Document}
 * to read DOM information.
 *
 * @returns query string adhering to the query EBNF
 */
CampusExplorer.buildQuery = function () {
    const activeTab = document.getElementsByClassName("nav-item tab active");

    if (activeTab[0].getAttribute("data-type") === "courses") {
        return buildCoursesQuery();
    } else if (activeTab[0].getAttribute("data-type") === "rooms") {
        return buildRoomsQuery();
    }
};

const buildCoursesQuery = () => {
    const courseDatasetSection = buildCoursesDatasetSection();

    const conditionsContainer = document.getElementsByClassName("conditions-container");
    const courseConditionElements = conditionsContainer[0].getElementsByClassName("control-group condition");
    const courseFilterSection = buildFilterSection(courseConditionElements);

    const columnsDiv = document.getElementsByClassName("form-group columns");
    const controlGroup = columnsDiv[0].getElementsByClassName("control-group");
    let displaySection = buildDisplaySection(controlGroup);

    const orderFieldsDiv = document.getElementsByClassName("control order fields");
    const orderDiv = orderFieldsDiv[0].getElementsByTagName("OPTION");
    const orderSection = buildOrderSection(orderDiv);
    if (orderSection === ".") {
        displaySection = displaySection.substring(0, displaySection.length - 2);
    }
    return courseDatasetSection + courseFilterSection + displaySection + orderSection;
};

const buildRoomsQuery = () => {
    const roomDatasetSection = buildRoomsDatasetSection();

    const conditionsContainer = document.getElementsByClassName("conditions-container");
    const roomConditionElements = conditionsContainer[1].getElementsByClassName("control-group condition");
    const roomFilterSection = buildFilterSection(roomConditionElements);

    const columnsDiv = document.getElementsByClassName("form-group columns");
    const controlGroup = columnsDiv[1].getElementsByClassName("control-group");
    let roomDisplaySection = buildDisplaySection(controlGroup);

    const orderFieldsDiv = document.getElementsByClassName("control order fields");
    const orderDiv = orderFieldsDiv[1].getElementsByTagName("OPTION");
    const roomsOrderSection = buildOrderSection(orderDiv);
    if (roomsOrderSection === ".") {
        roomDisplaySection = roomDisplaySection.substring(0, roomDisplaySection.length - 2);
    }

    return roomDatasetSection + roomFilterSection + roomDisplaySection + roomsOrderSection;
};

const buildCoursesDatasetSection = () => {
    let coursesDatasetSection = "";
    const groupsDiv = document.getElementsByClassName("form-group groups");
    const courseControlFields = groupsDiv[0].getElementsByClassName("control field");
    const checkedGroups = checkForGroups(courseControlFields);
    if (checkedGroups.length === 0) {
        coursesDatasetSection = "In courses dataset courses, ";
    } else if (checkedGroups.length === 1) {
        coursesDatasetSection = `In courses dataset courses grouped by ${checkedGroups}, `;
    } else if (checkedGroups.length === 2) {
        coursesDatasetSection = `In courses dataset courses grouped by ${checkedGroups[0]} and ${checkedGroups[1]}, `;
    } else if (checkedGroups.length > 2) {
        coursesDatasetSection = "In courses dataset courses grouped by ";
        for (let i = 0; i < checkedGroups.length - 2; i++) {
            coursesDatasetSection += `${checkedGroups[i]}, `;
        }
        coursesDatasetSection += `${checkedGroups[checkedGroups.length - 2]} and ${checkedGroups[checkedGroups.length - 1]}, `;
    }
    return coursesDatasetSection;
};

const buildRoomsDatasetSection = () => {
    let roomsDatasetSection = "";
    const groupsDiv = document.getElementsByClassName("form-group groups");
    const roomsControlFields = groupsDiv[1].getElementsByClassName("control field");
    const checkedGroups = checkForGroups(roomsControlFields);
    if (checkedGroups.length === 0) {
        roomsDatasetSection = "In rooms dataset rooms, ";
    } else if (checkedGroups.length === 1) {
        roomsDatasetSection = `In rooms dataset rooms grouped by ${checkedGroups}, `;
    } else if (checkedGroups.length === 2) {
        roomsDatasetSection = `In rooms dataset rooms grouped by ${checkedGroups[0]} and ${checkedGroups[1]}, `;
    } else if (checkedGroups.length > 2) {
        roomsDatasetSection = "In rooms dataset rooms grouped by ";
        for (let i = 0; i < checkedGroups.length - 2; i++) {
            roomsDatasetSection += `${checkedGroups[i]}, `;
        }
        roomsDatasetSection += `${checkedGroups[checkedGroups.length - 2]} and ${checkedGroups[checkedGroups.length - 1]}, `;
    }
    return roomsDatasetSection;
};

const buildFilterSection = (conditionElements) => {
    let filterSection = "";
    const allConditionsElem = document.getElementById("courses-conditiontype-all");
    const anyConditionsElem = document.getElementById("courses-conditiontype-any");
    const noneConditionsElem = document.getElementById("courses-conditiontype-none");

    if (allConditionsElem.getAttribute("checked") === "checked") {
        const filters = createFilters(conditionElements, false);
        if (filters.length === 0) {
            filterSection = "find all entries; "
        } else if (filters.length === 1) {
            filterSection = `find entries whose ${filters[0]}; `;
        } else if (filters.length === 2) {
            filterSection = `find entries whose ${filters[0]} and ${filters[1]}; `;
        } else if (filters.length > 2) {
            filterSection = "find entries whose ";
            for (let i = 0; i < filters.length - 2; i++) {
                filterSection += filters[i] + ", ";
            }
            filterSection += `${filters[filters.length - 2]} and ${filters.length - 1}`;
        }
    } else if (anyConditionsElem.getAttribute("checked") === "checked") {
        const filters = createFilters(conditionElements, false);
        if (filters.length === 0) {
            filterSection = "find all entries; "
        } else if (filters.length === 1) {
            filterSection = `find entries whose ${filters[0]}; `;
        } else if (filters.length === 2) {
            filterSection = `find entries whose ${filters[0]} or ${filters[1]}; `;
        } else if (filters.length > 2) {
            filterSection = "find entries whose ";
            for (let i = 0; i < filters.length - 2; i++) {
                filterSection += filters[i] + ", ";
            }
            filterSection += `${filters[filters.length - 2]} or ${filters.length - 1}`;
        }
    } else if (noneConditionsElem.getAttribute("checked") === "checked") {
        const filters = createFilters(conditionElements, true);
        if (filters.length === 0) {
            filterSection = "find all entries; "
        } else if (filters.length === 1) {
            filterSection = `find entries whose ${filters[0]}; `;
        } else if (filters.length === 2) {
            filterSection = `find entries whose ${filters[0]} and ${filters[1]}; `;
        } else if (filters.length > 2) {
            filterSection = "find entries whose ";
            for (let i = 0; i < filters.length - 2; i++) {
                filterSection += filters[i] + ", ";
            }
            filterSection += `${filters[filters.length - 2]} and ${filters.length - 1}`;
        }
    }
    return filterSection;

};

const buildDisplaySection = (displayDiv) => {
    let displaySection;
    // gets all checked elements containing columns to display
    const selectedKeys = displayDiv[0].getElementsByClassName("control field");
    const selectedAggs = displayDiv[0].getElementsByClassName("control transformation");
    const fieldsToDisplay = [];

    for (const fieldDiv of selectedKeys) {
        let input = fieldDiv.getElementsByTagName("INPUT");
        if (input[0].getAttribute("checked") === "checked") {
            let label = fieldDiv.getElementsByTagName("LABEL");
            fieldsToDisplay.push(label[0].innerHTML);
        }
    }

    for (const transDiv of selectedAggs) {
        let input = transDiv.getElementsByTagName("INPUT");
        if (input[0].getAttribute("checked") === "checked") {
            let label = transDiv.getElementsByTagName("LABEL");
            fieldsToDisplay.push(label[0].innerHTML);
        }
    }
    const transformationsDiv = document.getElementsByClassName("form-group transformations");
    // gets columns fields that are custom aggregate keys to build aggregate defs from
    const columnAggregateFields = displayDiv[0].getElementsByClassName("control transformation");

    if (hasAggregates(columnAggregateFields)) {
        const aggregates = buildAggregates(transformationsDiv);
        if (fieldsToDisplay.length === 1) {
            displaySection = `show ${fieldsToDisplay[0]}, where `
        } else if (fieldsToDisplay.length === 2) {
            displaySection = `show ${fieldsToDisplay[0]} and ${fieldsToDisplay[1]}, where `
        } else if (fieldsToDisplay.length > 2) {
            displaySection = "show ";
            for (let i = 0; i < fieldsToDisplay.length - 2; i++) {
                displaySection += fieldsToDisplay[i] + ", ";
            }
            displaySection += `${fieldsToDisplay[fieldsToDisplay.length - 2]} and ${fieldsToDisplay[fieldsToDisplay.length - 1]}, where `
        }

        if (aggregates.length === 1) {
            displaySection += aggregates[0] + "; ";
        } else if (aggregates.length === 2) {
            displaySection += `${aggregates[0]} and ${aggregates[1]}; `;
        } else if (aggregates.length > 2) {
            for (let i = 0; i < aggregates.length - 2; i++) {
                displaySection += aggregates[i] + ", ";
            }
            displaySection += `${aggregates[aggregates.length - 2]} and ${aggregates[aggregates.length - 1]}; `
        }
    } else {
        if (fieldsToDisplay.length === 1) {
            displaySection = `show ${fieldsToDisplay[0]}; `
        } else if (fieldsToDisplay.length === 2) {
            displaySection = `show ${fieldsToDisplay[0]} and ${fieldsToDisplay[1]}; `
        } else if (fieldsToDisplay.length > 2) {
            displaySection = "show ";
            for (let i = 0; i < fieldsToDisplay.length - 2; i++) {
                displaySection += fieldsToDisplay[i] + ", ";
            }
            displaySection += `${fieldsToDisplay[fieldsToDisplay.length - 2]} and ${fieldsToDisplay[fieldsToDisplay.length - 1]}; `
        }
    }
    return displaySection;
};

const buildAggregates = (transformationsDiv) => {
    const aggregates = [];
    const transGroups = transformationsDiv[0].getElementsByClassName("control-group transformation");
    for (const transformation of transGroups) {
        // gets the keyword of the query result transformation entered by user
        const controlTermDiv = transformation.getElementsByClassName("control term");
        const controlTermInput = controlTermDiv[0].getElementsByTagName("INPUT");
        const controlTerm = controlTermInput[0].getAttribute("value");
        // gets the operator (i.e. MAX, AVG, etc.) selected by the user
        const operatorDiv = transformation.getElementsByClassName("control operators");
        const selectedOperator = operatorDiv[0].querySelector(`[selected="selected"]`);
        const operatorVal = selectedOperator.getAttribute("value");
        // gets the keyword of the column the transformation will be performed on
        const controlFieldDiv = transformation.getElementsByClassName("control fields");
        const selectedField = controlFieldDiv[0].querySelector(`[selected="selected"]`);
        const selectedVal = selectedField.innerHTML.trim();
        let aggregate = `${controlTerm} is the ${operatorVal} of ${selectedVal}`;
        aggregates.push(aggregate);
    }
    return aggregates;
};

const buildOrderSection = (orderDiv) => {
    const sortingOrderDiv = document.getElementsByClassName("control descending");
    const sortingInput = sortingOrderDiv[0].querySelector("input");
    const selectedFields = [];
    let orderSection;

    // First checks to see if any fields have been selected to sort query results on
    for (const orderField of orderDiv) {
        if (orderField.getAttribute("selected") === "selected") {
            selectedFields.push(orderField.innerHTML.trim());
        }
    }

    // If fields are selected, checks what order results are to be sorted in and returns the correct ORDER prefix
    // returns "." as the end of the query if no fields are checked
    if (selectedFields.length >= 1 && sortingInput.getAttribute("checked") === "checked") {
        orderSection = "sort in descending order by ";
    } else if ((selectedFields.length >= 1 && sortingInput.getAttribute("checked") !== "checked")) {
        orderSection = "sort in ascending order by ";
    } else {
        orderSection = ".";
    }

    // adds selected fields to the ORDER section of the query
    if (selectedFields.length === 1) {
        orderSection += selectedFields[0] + ".";
    } else if (selectedFields.length === 2) {
        orderSection += `${selectedFields[0]} and ${selectedFields[1]}.`;
    } else if (selectedFields.length > 2) {
        for (let i = 0; i < selectedFields.length - 2; i++) {
            orderSection += `${selectedFields[i]}, `;
        }
        orderSection += `${selectedFields[selectedFields.length - 2]} and ${selectedFields[selectedFields.length - 1]}.`;
    }
    return orderSection;
};

const hasAggregates = (columns) => {
    return columns.length >= 1;
};

const checkForGroups = function (groups) {
    const checkedGroups = [];
    for (const group of groups) {
        let currentInputElem = group.querySelector("input");
        if (currentInputElem.getAttribute("checked") === "checked") {
            let labelElement = group.querySelector("label");
            checkedGroups.push(labelElement.innerHTML);
        }
    }
    return checkedGroups;
};

const createFilters = (conditions, isNotQuery) => {
    const filterStrings = [];
    for (const condition of conditions) {
        // Gets the Not checkbox div
        const notDiv = condition.getElementsByClassName("control not");
        // Checks if the Not checkbox is selected
        const notDivInput = notDiv[0].querySelector("input");
        const checkedNot = notDivInput.getAttribute("checked");
        // Gets the control fields div containing selected elements with query keywords
        const controlFields = condition.getElementsByClassName("control fields");
        const fieldSelectElement = controlFields[0].querySelector("select");
        // Gets the option elements containing M-keys and S-keys for the query and their selected status
        const fieldOptions = fieldSelectElement.getElementsByTagName("OPTION");
        // Gets the Control Operators div and it's options values --> LT, GT, etc.
        const controlOperators = condition.getElementsByClassName("control operators");
        const operatorsSelectElement = controlOperators[0].querySelector("select");
        const operatorOptions = operatorsSelectElement.getElementsByTagName("OPTION");
        // Gets the Control Term div that contains the input element
        const controlTerm = condition.getElementsByClassName("control term");
        // Gets the actual value of the current query condition
        const controlTermValue = controlTerm[0].querySelector("input").getAttribute("value");
        let filterString = "";
        for (const fieldOption of fieldOptions) {
            if (fieldOption.getAttribute("selected") === "selected") {
                filterString += fieldOption.innerHTML.trim() + " ";
            }
        }
        for (const operatorOption of operatorOptions) {
            if (operatorOption.getAttribute("selected") === "selected") {
                if (operatorOption.getAttribute("value") === "EQ" && checkedNot !== "checked" && !isNotQuery) {
                    filterString += "is equal to ";
                } else if (operatorOption.getAttribute("value") === "EQ" && (isNotQuery || checkedNot === "checked")) {
                    filterString += "is not equal to ";
                }
                if (operatorOption.getAttribute("value") === "GT" && checkedNot !== "checked" && !isNotQuery) {
                    filterString += "is greater than ";
                } else if (operatorOption.getAttribute("value") === "GT" && (checkedNot === "checked" || isNotQuery)) {
                    filterString += "is not greater than ";
                }
                if (operatorOption.getAttribute("value") === "LT" && checkedNot !== "checked" && !isNotQuery) {
                    filterString += "is less than ";
                } else if (operatorOption.getAttribute("value") === "LT" && (checkedNot === "checked" || isNotQuery)) {
                    filterString += "is not less than "
                }
                if (operatorOption.getAttribute("value") === "IS" && !controlTermValue.includes("*") &&
                    checkedNot !== "checked" && !isNotQuery) {
                    filterString += "is ";
                } else if (operatorOption.getAttribute("value") === "IS" && !controlTermValue.includes("*") &&
                    (checkedNot === "checked" || isNotQuery)) {
                    filterString += "is not ";
                } else if (operatorOption.getAttribute("value") === "IS" && controlTermValue.includes("*")
                    && checkedNot !== "checked" && !isNotQuery) {
                    if (controlTermValue === `*${controlTermValue}*`) {
                        filterString += "includes "
                    } else if (controlTermValue === `${controlTermValue}*`) {
                        filterString += "begins with "
                    }
                    if (controlTermValue === `*${controlTermValue}`) {
                        filterString += "ends with "
                    }
                } else if (operatorOption.getAttribute("value") === "IS" && controlTermValue.includes("*")
                    && (checkedNot === "checked" || isNotQuery)) {
                    if (controlTermValue === `*${controlTermValue}*`) {
                        filterString += "does not include "
                    } else if (controlTermValue === `${controlTermValue}*`) {
                        filterString += "does not begin with "
                    }
                    if (controlTermValue === `*${controlTermValue}`) {
                        filterString += "does not end with "
                    }
                }
                if (isNaN(Number(controlTermValue))) {
                    filterString += "\"" + controlTermValue + "\"";
                } else {
                    filterString += controlTermValue;
                }
                filterStrings.push(filterString);
            }
        }
    }
    return filterStrings;
};

