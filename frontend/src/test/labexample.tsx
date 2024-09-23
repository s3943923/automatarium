import { useLabsStore } from '/src/stores'
import { StoredLab } from '/src/stores/useLabStore'
  
// Lab example
export const lab: StoredLab = {
"_id": "3b2c5285-5679-4642-8cca-c274cbe9123d",
"description": "Test your knowledge of Finite State Automata and Push Down Automata.",
"projects": [
    {
        "projectType": "FSA",
        "_id": "e653c38d-4ec1-4d0c-930b-e12dd692a24e",
        "states": [
            {
                "x": 120,
                "y": 180,
                "id": 0,
                "isFinal": false
            },
            {
                "x": 510,
                "y": 180,
                "id": 1,
                "isFinal": true
            }
        ],
        "transitions": [
            {
                "from": 0,
                "to": 0,
                "id": 0,
                "read": "a"
            }
        ],
        "comments": [],
        "simResult": [],
        "tests": {
            "single": "",
            "batch": [
                ""
            ]
        },
        "initialState": 0,
        "meta": {
            "name": "FSA and PDA Lab",
            "dateCreated": 1727006626621,
            "dateEdited": 1727075660768,
            "version": "1.0.0",
            "automatariumVersion": "1.0.0"
        },
        "config": {
            "type": "FSA",
            "statePrefix": "q",
            "orOperator": "|",
            "acceptanceCriteria": "both",
            "color": "pink"
        }
    },
    {
        "projectType": "FSA",
        "_id": "abfc3e70-f41f-4f22-8e5a-20e2c5daf2d0",
        "states": [
            {
                "x": 195,
                "y": 135,
                "id": 0,
                "isFinal": false
            },
            {
                "x": 480,
                "y": 135,
                "id": 1,
                "isFinal": true
            }
        ],
        "transitions": [
            {
                "from": 0,
                "to": 0,
                "id": 0,
                "read": "01"
            },
            {
                "from": 0,
                "to": 1,
                "id": 1,
                "read": "1"
            }
        ],
        "comments": [
            {
                "x": 120,
                "y": -15,
                "text": "NFA",
                "id": 0
            },
            {
                "x": 120,
                "y": 255,
                "text": "DFA",
                "id": 1
            }
        ],
        "simResult": [],
        "tests": {
            "single": "",
            "batch": [
                ""
            ]
        },
        "initialState": 0,
        "meta": {
            "name": "FSA and PDA Lab",
            "dateCreated": 1727006875828,
            "dateEdited": 1727075667352,
            "version": "1.0.0",
            "automatariumVersion": "1.0.0"
        },
        "config": {
            "type": "FSA",
            "statePrefix": "q",
            "orOperator": "|",
            "acceptanceCriteria": "both",
            "color": "pink"
        }
    },
    {
        "projectType": "PDA",
        "_id": "94f18d83-997a-45ac-a0ec-1a0eb00bb27d",
        "states": [
            {
                "x": 210,
                "y": 120,
                "id": 0,
                "isFinal": false
            },
            {
                "x": 480,
                "y": 120,
                "id": 1,
                "isFinal": true
            }
        ],
        "transitions": [
            {
                "from": 0,
                "to": 1,
                "id": 0,
                "read": "",
                "pop": "",
                "push": ""
            },
            {
                "from": 0,
                "to": 0,
                "id": 1,
                "read": "a",
                "pop": "",
                "push": "AA"
            },
            {
                "from": 0,
                "to": 0,
                "id": 2,
                "read": "b",
                "pop": "A",
                "push": ""
            }
        ],
        "comments": [],
        "simResult": [],
        "tests": {
            "single": "",
            "batch": [
                ""
            ]
        },
        "initialState": 0,
        "meta": {
            "name": "FSA and PDA Lab",
            "dateCreated": 1727007080754,
            "dateEdited": 1727075668431,
            "version": "1.0.0",
            "automatariumVersion": "1.0.0"
        },
        "config": {
            "type": "PDA",
            "statePrefix": "q",
            "orOperator": "|",
            "acceptanceCriteria": "both",
            "color": "pink"
        }
    },
    {
        "projectType": "PDA",
        "_id": "0fae1878-0888-46ee-a245-6f025b1240cb",
        "states": [],
        "transitions": [],
        "comments": [],
        "simResult": [],
        "tests": {
            "single": "",
            "batch": [
                ""
            ]
        },
        "initialState": null,
        "meta": {
            "name": "FSA and PDA Lab",
            "dateCreated": 1727007273704,
            "dateEdited": 1727075550296,
            "version": "1.0.0",
            "automatariumVersion": "1.0.0"
        },
        "config": {
            "type": "PDA",
            "statePrefix": "q",
            "orOperator": "|",
            "acceptanceCriteria": "both",
            "color": "pink"
        }
    }
],
"questions": {
    "e653c38d-4ec1-4d0c-930b-e12dd692a24e": "Given the regular expression, a*b*c, build an equivalent NFA. \n\nTo get you started the initial and final states are provided. ",
    "abfc3e70-f41f-4f22-8e5a-20e2c5daf2d0": "Consider the language L = {w1 | w ∈ {0,1}*}, that is the language of all strings over 0 and 1 that end with 1. \n\nYou are provided with the NFA.\n\nBuild an equivalent DFA. ",
    "94f18d83-997a-45ac-a0ec-1a0eb00bb27d": "The easiest way to think about a PDA is an extension of finite state machines, with the addition of a stack, giving them the ability to count. \n\nConsider the language \nL = {w ∈ {a, b}*, where w has twice has many b's as a's }\n\nConstruct a PDA for L. \n\nYou are provided with all states necessary, just fill out the missing transitions to complete the PDA.\n",
    "0fae1878-0888-46ee-a245-6f025b1240cb": "Consider the language \nL = {w ∈ {a,b}*, where w = w^R}\n\nConstruct a PDA that accepts L.\n\nHint: this is a palindrome.\n"
},
"meta": {
    "name": "FSA and PDA Lab",
    "dateCreated": 1727006626621,
    "dateEdited": 1727006626621,
    "version": "1.0.0",
    "automatariumVersion": "1.0.0"
},
}