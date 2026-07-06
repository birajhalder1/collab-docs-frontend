"use client";

import { Editor } from "@tiptap/react";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Undo2,
  Redo2,
  Heading1,
} from "lucide-react";

interface ToolbarProps {
  editor: Editor | null;
}

export default function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  const buttonClass = (active: boolean) =>
    `rounded-lg p-2 transition ${
      active ? "bg-blue-600 text-white" : "hover:bg-slate-100"
    }`;

  return (
    <div className="mb-4 flex flex-wrap gap-2 rounded-lg border bg-white p-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive("bold"))}
      >
        <Bold size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive("italic"))}
      >
        <Italic size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={buttonClass(editor.isActive("underline"))}
      >
        <UnderlineIcon size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 1 }))}
      >
        <Heading1 size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive("bulletList"))}
      >
        <List size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive("orderedList"))}
      >
        <ListOrdered size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().undo().run()}
        className={buttonClass(false)}
      >
        <Undo2 size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        className={buttonClass(false)}
      >
        <Redo2 size={18} />
      </button>
    </div>
  );
}
