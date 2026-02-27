import uglify from "@gesslar/uglier"

export default [
  ...uglify({
    with: ["lints-js", "lints-jsdoc", "web"],
  })
]
