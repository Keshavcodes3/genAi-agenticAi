import { createEditorSystem, richTextExtension, boldExtension, italicExtension, historyExtension } from "@lexkit/editor"

// Define your extensions (as const for type safety)
const extensions = [
    richTextExtension.configure({
        placeholder: "Start writing...",
        classNames: {
            container: "my-editor-container",
            contentEditable: "my-editor-content",
            placeholder: "my-editor-placeholder"
        }
    }),
    boldExtension,
    italicExtension,
    historyExtension
] as const

// Create typed editor system
const { Provider, useEditor } = createEditorSystem < typeof extensions > ()

function MyEditor() {
    return (
        <Provider extensions={extensions}>
            <div className="my-editor">

            </div>
        </Provider>
    )
}