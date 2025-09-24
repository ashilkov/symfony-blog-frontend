import "../assets/styles/tiptap.css";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extensions";
import FileHandler from "@tiptap/extension-file-handler";
import { uploadImage } from "../lib/file";

export function TiptapEditor({ content = "", name = "", onChange }) {
  const editor = useEditor({
    editable: true, // make it read-only
    content: content || "", // HTML string
    extensions: [
      StarterKit,
      Highlight,
      Link,
      Image,
      Typography,
      Placeholder.configure({ placeholder: "Write something ..." }),
      FileHandler.configure({
        allowedMimeTypes: [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/webp",
        ],
        onDrop: async (currentEditor, files, pos) => {
          for (let file of files) {
            try {
              const url = await uploadImage({ file: file });
              currentEditor
                .chain()
                .insertContentAt(pos, {
                  type: "image",
                  attrs: {
                    src: url,
                    style: "max-width:100%; max-height:400px;",
                  },
                })
                .focus()
                .run();
            } catch (error) {
              console.error("Error uploading file:", error);
            }
          }
        },
        onPaste: async (currentEditor, files, htmlContent) => {
          for (let file of files) {
            if (htmlContent) {
              console.log(htmlContent);
              return false;
            }
            try {
              const url = await uploadImage({ file: file });
              currentEditor
                .chain()
                .insertContentAt(currentEditor.state.selection.anchor, {
                  type: "image",
                  attrs: {
                    src: url,
                    style: "max-width:100%; max-height:400px;",
                  },
                })
                .focus()
                .run();
            } catch (error) {
              console.error("Error uploading file:", error);
            }
          }
        },
      }),
    ],
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        name: name,
        class: "tiptap-editor",
      },
    },
  });

  // editor created/destroyed by useEditor automatically
  return <EditorContent editor={editor} />;
}
