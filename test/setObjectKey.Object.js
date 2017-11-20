
const { test } = require('ava')

const tree = {
    "type": "root",
    "children": [
      {
        "type": "heading",
        "depth": 2,
        "children": [
          {
            "type": "text",
            "value": "Hello",
            "position": {
              "start": {
                "line": 1,
                "column": 4,
                "offset": 3
              },
              "end": {
                "line": 1,
                "column": 9,
                "offset": 8
              },
              "indent": []
            }
          }
        ],
        "position": {
          "start": {
            "line": 1,
            "column": 1,
            "offset": 0
          },
          "end": {
            "line": 1,
            "column": 9,
            "offset": 8
          },
          "indent": []
        }
      }
    ],
    "position": {
      "start": {
        "line": 1,
        "column": 1,
        "offset": 0
      },
      "end": {
        "line": 2,
        "column": 1,
        "offset": 9
      }
    }
  }



const truetree = {
    "type": "root",
    "children": [
      {
        "type": "heading",
        "depth": 2,
        "children": [
          {
            "type": "text",
            "value": "你好",
            "position": {
              "start": {
                "line": 1,
                "column": 4,
                "offset": 3
              },
              "end": {
                "line": 1,
                "column": 9,
                "offset": 8
              },
              "indent": []
            }
          }
        ],
        "position": {
          "start": {
            "line": 1,
            "column": 1,
            "offset": 0
          },
          "end": {
            "line": 1,
            "column": 9,
            "offset": 8
          },
          "indent": []
        }
      }
    ],
    "position": {
      "start": {
        "line": 1,
        "column": 1,
        "offset": 0
      },
      "end": {
        "line": 2,
        "column": 1,
        "offset": 9
      }
    }
  }

module.exports = [tree, truetree]