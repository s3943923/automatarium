import { TMGraphNode, TMGraph } from "./TMSearch";
import { TMGraphIn } from "./graph"
import {
  Tape,
  TMExecutionResult,
  TMExecutionTrace,
} from "./graph";
import { breadthFirstSearch } from "./search";

const generateTrace = (node: TMGraphNode): TMExecutionTrace[] => {
  const trace: TMExecutionTrace[] = [];
  while (node.parent) {
    trace.push({
      to: node.state.id,
      tape: node.state.tape,
    });
    node = node.parent;
  }
  trace.push({
    to: node.state.id,
    tape: node.state.tape,
  });
  return trace.reverse();
};

export const simulateTM = (
    graphIn: TMGraphIn,
    // This forces front end to through a tape
    inputTapeIn: Tape,
): TMExecutionResult => {
  const inputTape = structuredClone(inputTapeIn)
  const graph = structuredClone(graphIn)
  const initialState = graph.states.find((state) => {
    return state.id === graph.initialState;
  })


  if (!initialState) {
    return {
      halted: false,
      tape: inputTape,
      trace: [],
    };
  }
  initialState.tape = inputTape;

  const problem = new TMGraph(new TMGraphNode(initialState), graph.states, graph.transitions);
  const result = breadthFirstSearch(problem);

  if (!result) {
    const emptyExecution: TMExecutionResult = {
      trace: [{ to: 0, tape: null }],
      halted: false,
      tape: inputTape,
    };
    return emptyExecution;
  }
  return {
    halted: result.state.isFinal,
    tape: result.state.tape,
    trace: generateTrace(result),
  };
};

