import {init} from "https://esm.sh/modern-monaco"
import wrapify from "https://cdn.jsdelivr.net/npm/@gesslar/wrapify"
import {vsToMonaco} from "./vscode-theme-to-monaco.js"

let editor
let resizeObserver

async function initializeEditor() {
  const container = document.getElementById("container")
  if(!container)
    return

  const monaco = await init()

  // Load and register a VS Code theme for Monaco
  const vscodeTheme = await fetch("./themes/blackboard.color-theme.json")
    .then(r => r.json())
  const monacoTheme = vsToMonaco(vscodeTheme)
  monaco.editor.defineTheme("blackboard", monacoTheme)

  editor = monaco.editor.create(container, {
    value: "",
    language: "plaintext",
    theme: "blackboard",
    glyphMargin: false,
    lineNumbers: "off",
    minimap: {enabled: false},
    overviewRulerBorder: false,
    overviewRulerLanes: 0,
    scrollBeyondLastLine: false,
    contextmenu: false,
    tabSize: 3,
    insertSpaces: true,
    renderLineHighlight: "none",
    rulers: [80],
  })

  const {width, height} = container.getBoundingClientRect()
  editor.layout({width, height})
  editor.focus()

  resizeObserver = new ResizeObserver(() => {
    if(!editor)
      return

    const {width, height} = container.getBoundingClientRect()
    editor.layout({width, height})
  })

  resizeObserver.observe(container)
}

function wrapIt() {
  if(!editor || typeof wrapify !== "function")
    return

  editor.setValue(wrapify(editor.getValue(), 80, 0))
  editor.focus()
}

function handleKeyboardShortcuts(event) {
  if(event.ctrlKey && event.key.toLowerCase() === "e") {
    event.preventDefault()
    editor?.focus()
  }
}

window.initializeEditor = initializeEditor
window.wrapIt = wrapIt

window.addEventListener("DOMContentLoaded", () => {
  initializeEditor().catch(error => console.error("Failed to initialize Monaco", error))
})

window.addEventListener("keydown", handleKeyboardShortcuts)
