import "../assets/styles/tiptap.css";
import "tiptap-extension-resizable-image/styles.css";

import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
// import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { Placeholder } from "@tiptap/extensions";
import { uploadImage } from "../lib/file";
import { ResizableImage } from "tiptap-extension-resizable-image";
import { Link, RichTextEditor } from "@mantine/tiptap";

export function TiptapEditor({ content = "", name = "", onChange }) {
  const editor = useEditor({
    editable: true, // make it read-only
    content: content || "", // HTML string
    extensions: [
      StarterKit,
      Highlight,
      Link,
      Typography,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Write something ..." }),
      ResizableImage.configure({
        defaultWidth: 200,
        defaultHeight: 200,
        async onUpload(file: File) {
          let src = URL.createObjectURL(file);
          console.log(src);
          try {
            src = await uploadImage({ file: file });
          } catch (error) {
            console.error("Error uploading file:", error);
          }
          console.log(src);
          return {
            src,
            "data-keep-ratio": true,
          };
        },
      }),
    ],
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        name: name,
        // class: "tiptap-editor",
      },
    },
    immediatelyRender: false,
  });

  return (
    <RichTextEditor
      editor={editor}
      classNames={{
        content: "content",
        toolbar: "toolbar",
      }}
    >
      <RichTextEditor.Toolbar sticky stickyOffset={60}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );

  // editor created/destroyed by useEditor automatically
  return <EditorContent editor={editor} className="editor" />;
}
