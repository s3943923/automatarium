import { FSAGraphIn, FSAState, FSATransition, StateID, ReadSymbol } from './graph'

// This will check to ensure that the graph passed in has valid states/transitions before continuing
export const statesAndTransitionsPresent = (nfaGraph: FSAGraphIn): boolean => {
    if (nfaGraph.states.length == 0 && nfaGraph.transitions.length == 0) {
        return false;
    }
    else {
        return true;
    }
}

// This will check to ensure that the graph passed in has a final state before continuing
export const finalStateIsPresent = (nfaGraphStates: FSAState[]): boolean => {
    const numberOfNFAStates: number = nfaGraphStates.length;
    let doesFinalExist: boolean = false
    for (let curElem = 0; curElem < numberOfNFAStates; curElem++) {
        if (nfaGraphStates[curElem].isFinal) {
            doesFinalExist = true;
        }
    }
    if (!doesFinalExist) {
        return false;
    }
    else {
        return true;
    }
}

// This will check to ensure that the graph passed in has an initial state before continuing
export const initialStateIsPresent = (nfaGraphInitialState: StateID): boolean => {
    if (nfaGraphInitialState == null) {
        return false;
    }
    else {
        return true;
    }
}

// This will create a mapping of the symbols and the common "to" states, this will enable new states to be created if needed for the DFA
export function createSymbolsToStateMap(initialTransitionTable: {[key: StateID]: [StateID, ReadSymbol][]}): {[key: ReadSymbol]: StateID[]} {
    let symbolToStatesMap: {[key: ReadSymbol]: StateID[]} = {};
    for (let fromStateID in initialTransitionTable) {
        let transitions = initialTransitionTable[fromStateID];
        for (let curElem = 0; curElem < transitions.length; curElem++) {
            let toStateID = transitions[curElem][0];
            let symbol = transitions[curElem][1];    
            if (symbolToStatesMap.hasOwnProperty(symbol)) {
                symbolToStatesMap[symbol].push(toStateID);
            } 
            else {
                symbolToStatesMap[symbol] = [toStateID];
            }
        }
    }
    return symbolToStatesMap;
}

// This will create a transition table such that the DFA can be constructed from it. It will return a transitionTable that consists of keys of arrays of key value pairs, where
// the number of keys is equal to the number of states (each key equal to a StateID), where each key will then consist of an array of key value pairs, where the key in this case
// is a StateID of the state the original key (or state in this case) transitions to, and the value is the ReadSymbol for this transition.
export function createTransitionTable(nfaGraph: FSAGraphIn, numberOfNFATransitions: number, numberOfNFAStates: number): {[key: StateID]: [StateID, ReadSymbol][]} {
    let initialTransitionTable: {[key: StateID]: [StateID, ReadSymbol][]} = {};
    let finalTransitionTable: {[key: StateID]: [StateID, ReadSymbol][]} = {};
    let symbolToStatesMap: {[key: ReadSymbol]: StateID[]} = {};
    let symbolsPresent = new Set<ReadSymbol>();

    // This will create the initial transition table. Note that this is not the final transition table as this is still in NFA form.
    for (let curElem = 0; curElem < numberOfNFAStates; curElem++) {
        initialTransitionTable[curElem] = [];
        finalTransitionTable[curElem] = [];
        for (let curStateID = 0; curStateID < numberOfNFATransitions; curStateID++) {
            if (nfaGraph.transitions[curStateID].from == curElem) {
                initialTransitionTable[curElem].push([nfaGraph.transitions[curStateID].to, nfaGraph.transitions[curStateID].read[0]]);
                symbolsPresent.add(nfaGraph.transitions[curStateID].read[0]);
            }
        }
    }

    // This will ensure that all states that do not have a transition for all symbols do, which will lead to a "trap state". This is required to be a DFA
    let symbolsArray = Array.from(symbolsPresent);
    let nextAvailableStateID = numberOfNFAStates;
    // Go through all the original states defined and see if new states need to be created
    for (let stateID = 0; stateID < numberOfNFAStates; stateID++) {
        // If there isn't a transition going from a particular state, a new state isn't required, it can just transition to itself and still be
        // a trap state. Not strictly required but it will make everything look nicer.
        let hasTransitions = initialTransitionTable[stateID].length > 0;
        if (!hasTransitions && !nfaGraph.states[stateID].isFinal) {
            for (let curElem = 0; curElem < symbolsArray.length; curElem++) {
                initialTransitionTable[stateID].push([stateID, symbolsArray[curElem]]);
            }
        }
        // Else go each transition and if a symbol is not found, make a new state for it and transition to that state with the given symbol.
        else {
            for (let curElem = 0; curElem < symbolsArray.length; curElem++) {
                let symbolFound = false;
                for (let [toStateID, readSymbol] of initialTransitionTable[stateID]) {
                    if (readSymbol === symbolsArray[curElem]) {
                        symbolFound = true;
                        break;
                    }
                }
                if (!symbolFound) {
                    initialTransitionTable[stateID].push([nextAvailableStateID, symbolsArray[curElem]]);
                    symbolsPresent.add(symbolsArray[curElem]);
                }
            }
            // With this new state, since it is a trap state, just transition to itself for every possible symbol.
            initialTransitionTable[nextAvailableStateID] = [];
            for (let curElem = 0; curElem < symbolsArray.length; curElem++) {
                initialTransitionTable[nextAvailableStateID].push([nextAvailableStateID, symbolsArray[curElem]]);
            }
            nextAvailableStateID++;
        }
    }

    // could potentailly put this in a for loop that continues to loop and add states to the DFA if needed, while keeping track of how many states there were before the loop so as to
    // not repeat
    symbolToStatesMap = createSymbolsToStateMap(initialTransitionTable);


    console.log("Common Symbol States");
    console.log(symbolToStatesMap);
    // This will create the finalTransitionTable from the initial one, which will represent the transition table of the new DFA.
    console.log("Initial Transition Table");
    console.log(initialTransitionTable);
    console.log("All symbols");
    console.log(symbolsPresent);
    return initialTransitionTable;
}

// This will create the DFA and return it by updating a passed in DFA template from a passed in NFA
export const createDFA = (nfaGraph: FSAGraphIn, dfaGraph: FSAGraphIn): FSAGraphIn => {
  const numberOfNFATransitions: number = nfaGraph.transitions.length;
  const numberOfNFAStates: number = nfaGraph.states.length;

  let transitionTable: {[key: StateID]: [StateID, ReadSymbol][]} = createTransitionTable(nfaGraph, numberOfNFATransitions, numberOfNFAStates);
  return dfaGraph;
}

export const convertNFAtoDFA = (nfaGraph: FSAGraphIn): FSAGraphIn => {
    if (!statesAndTransitionsPresent(nfaGraph)) {
        return nfaGraph;
    }
    else if (!initialStateIsPresent(nfaGraph.initialState)) {
        return nfaGraph;
    }
    else if (!finalStateIsPresent(nfaGraph.states)) {
        return nfaGraph;
    }
    else {
        let dfaGraph = {
            initialState: undefined as StateID,
            states: [] as FSAState[],
            transitions: [] as FSATransition[]
        }

        // Create a DFA from the given NFA
        dfaGraph = createDFA(nfaGraph, dfaGraph);

        console.log("Ignore below");
        console.log(nfaGraph.states);
        console.log(nfaGraph.transitions);
        console.log(nfaGraph.initialState);
        console.log(nfaGraph.transitions[0].read)
        return nfaGraph;
    }
}