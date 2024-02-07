import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

interface EditorProps {
  showPollEditor: boolean;
}

const getEditor = ({ showPollEditor }: EditorProps) => useEditor({
  editorProps: {
    attributes: {
      class: 'my-4 block min-h-[65px] overflow-auto px-5 leading-6 sm:leading-[26px] focus:outline-none',
    },
  },
  extensions: [
    StarterKit,
    Placeholder.configure({
      showOnlyWhenEditable: true,
      placeholder: () => showPollEditor ? 'Ask a question...' : "What's happening?",
      emptyEditorClass: 'cursor-text before:content-[attr(data-placeholder)] before:absolute  before:whitespace-nowrap  before:text-gray-400  before-pointer-events-none',
    }),
  ],
 
})

export default getEditor;