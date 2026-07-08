"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Toolbar from "./Toolbar";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
}

export default function TipTapEditor({
  content,
  onChange,
  editable = true,
}: TipTapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,

    editable,

    extensions: [StarterKit, Underline],

    content,

    onUpdate({ editor }) {
      if (!editable) return;

      onChange(editor.getHTML());
    },
  });

  // Update editable state dynamically
  useEffect(() => {
    if (!editor) return;

    editor.setEditable(editable);
  }, [editable, editor]);

  // Sync content from parent
  useEffect(() => {
    if (!editor) return;

    if (editor.isFocused) return;

    if (editor.getHTML() !== content) {
      editor.commands.setContent(content, {
        emitUpdate: false,
      });
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <>
      {editable && <Toolbar editor={editor} />}

      <div className="rounded-lg border bg-white">
        <EditorContent
          editor={editor}
          className={`${!editable ? "cursor-default" : ""}`}
        />
      </div>
    </>
  );
}
