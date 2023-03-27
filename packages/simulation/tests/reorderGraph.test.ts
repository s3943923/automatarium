import { describe } from 'node:test'
import { UnparsedGraph } from '../src/graph'
import { reorderStates } from '../src/reorder'
import dibDipLambdaLoop from './graphs/dib_dip-lambdaloop.json'

describe('Reordering graph', () => {
  test('Simple graph can be rearranged', () => {
    // Only two state graph, didn't see reason for making JSON file
    const graph = {
      states: [
        {
          isFinal: true,
          x: 570,
          y: 255,
          id: 0
        },
        {
          isFinal: false,
          x: 405,
          y: 255,
          id: 1
        }
      ],
      transitions: [
        {
          from: 1,
          to: 0,
          id: 0,
          write: '',
          direction: 'R',
          read: ''
        }
      ],
      initialState: 1
    } as unknown as UnparsedGraph
    reorderStates(graph)
    expect(graph.initialState).toBe(0)

    expect(graph.states[0].id).toBe(1)
    expect(graph.states[0].isFinal).toBeTrue()

    expect(graph.states[1].id).toBe(0)
    expect(graph.states[1].isFinal).toBeFalse()

    expect(graph.transitions[0]).toMatchObject({
      from: 0,
      to: 1,
      write: '',
      direction: 'R',
      read: ''
    })
  })

  test('Cycles are handled', () => {
    const testVer = JSON.parse(JSON.stringify(dibDipLambdaLoop)) as UnparsedGraph
    reorderStates(testVer)
    expect(testVer).toMatchObject(dibDipLambdaLoop)
  })

  test('Lower ID path is taken first', () => {
    const testVer = JSON.parse(JSON.stringify(dibDipLambdaLoop)) as UnparsedGraph
    // We have to update both states and transitions. We will apply this mapping
    const mapping = {
      0: 2,
      1: 3,
      2: 6,
      3: 7,
      4: 4,
      5: 100,
      6: 200
    }
    testVer.initialState = mapping[0]
    for (const old in mapping) {
      const newVal = mapping[old]
      const oldVal = parseInt(old)
      testVer.states[oldVal].id = newVal
      dibDipLambdaLoop.transitions.forEach((x, i) => {
        const trans = testVer.transitions[i]
        if (x.from === oldVal) trans.from = newVal
        if (x.to === oldVal) trans.to = newVal
      })
    }

    testVer.states[1].id = 3
    // Make the lower path have lower value
    testVer.states[4].id = 4
    testVer.states[2].id = 6
    testVer.states[3].id = 7
    testVer.states[5].id = 100
    testVer.states[6].id = 200
    reorderStates(testVer)

    expect(testVer.states[1].id).toBe(1)
    expect(testVer.states[4].id).toBe(2)
    expect(testVer.states[5].id).toBe(3)
    expect(testVer.states[6].id).toBe(4)
    expect(testVer.states[2].id).toBe(5)
    expect(testVer.states[3].id).toBe(6)
  })
})
