// "use client";

// import { useMemo } from "react";
// import { useEditor, EditorContent } from "@tiptap/react";
// import Collaboration from "@tiptap/extension-collaboration";
// import StarterKit from "@tiptap/starter-kit";
// import { createCollaborationContext } from "@/collaboration/provider";
// import Toolbar from "./Toolbar";

// interface TipTapEditorProps {
//   documentId: string;
// }

// export default function TipTapEditor({ documentId }: TipTapEditorProps) {
//   const collaboration = useMemo(
//     () => createCollaborationContext(documentId),
//     [documentId],
//   );

//   const editor = useEditor({
//     immediatelyRender: false,

//     extensions: [
//       StarterKit.configure({
//         undoRedo: false,
//       }),

//       Collaboration.configure({
//         document: collaboration.doc,
//       }),
//     ],
//   });

//   if (!editor) {
//     return null;
//   }

//   return (
//     <>
//       <Toolbar editor={editor} />

//       <div className="rounded-lg border bg-white">
//         <EditorContent editor={editor} className="min-h-150 p-6" />
//       </div>
//     </>
//   );
// }

"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Toolbar from "./Toolbar";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,

    extensions: [StarterKit, Underline],

    content,

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    // Don't overwrite while the editor is focused.
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
      <Toolbar editor={editor} />

      {/* <div className="rounded-lg border bg-white">
        <EditorContent editor={editor} className="min-h-150 p-6" />
      </div> */}

      <div className="rounded-lg border bg-white">
        <EditorContent editor={editor} />
      </div>
    </>
  );
}
