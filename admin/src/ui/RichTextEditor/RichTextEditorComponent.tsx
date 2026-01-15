import { memo, useEffect } from "react";
import { RichTextEditor, Link } from "@mantine/tiptap";

import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Placeholder from "@tiptap/extension-placeholder";

import { useEditor } from "@tiptap/react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditorComponent = ({ value, onChange }: Props) => {
  
  const editor = useEditor({
    autofocus: false,
    extensions: [
      StarterKit.configure({ link: false }),
      Link,
      TextStyle,
      Color,
      FontFamily,
      Superscript,
      Subscript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: "Start typing your document...",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // keep HTML in form state
    },
  });
  useEffect(() => {
    if (!editor) return;

    const currentHTML = editor.getHTML();
    if (currentHTML !== value) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;


  return (
    <>
      <RichTextEditor editor={editor} style={{ minHeight: 200 }}>
        <RichTextEditor.Toolbar>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
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
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.ColorPicker
              colors={["#000000", "#ff0000", "#00ff00", "#0000ff", "#ffaa00"]}
            />
            <RichTextEditor.Color color="#000000" />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Undo />
            <RichTextEditor.Redo />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>

      <style>{`
        .custom-table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
        }

        .custom-table th,
        .custom-table td {
          border: 1px solid #ccc;
          padding: 8px;
          min-width: 50px;
        }

        .custom-table th {
          background: #f1f1f1;
          font-weight: 600;
        }

        .resizable-image-wrapper {
          display: block;
          margin: 12px 0;
        }

        .resizable-image-container {
          position: relative;
          margin: 8px auto;
        }

        .resizable-image-container.selected {
          outline: 2px solid #228be6;
          outline-offset: 2px;
        }

        .resizable-image-container img {
          display: block;
          user-select: none;
        }

        .ProseMirror .selectedCell {
          background-color: #e3f2fd;
        }

        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 16px 0;
          overflow: hidden;
        }

        .ProseMirror td,
        .ProseMirror th {
          min-width: 1em;
          border: 1px solid #ced4da;
          padding: 8px;
          position: relative;
          vertical-align: top;
        }

        .ProseMirror th {
          font-weight: bold;
          text-align: left;
          background-color: #f8f9fa;
        }

        .ProseMirror .tableWrapper {
          margin: 16px 0;
          overflow-x: auto;
        }

        .ProseMirror {
          padding: 16px;
          min-height: 300px;
        }

        .ProseMirror:focus {
          outline: none;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

export default memo(RichTextEditorComponent);
