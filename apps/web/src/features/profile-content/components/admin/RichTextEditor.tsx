"use client";

import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import type { ComponentType } from "react";

import { richTextClass } from "@/features/profile-content/utils/rich-text";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  id?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

type ToolbarAction = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  /** Nama mark/node untuk menandai tombol yang sedang aktif. */
  activeName?: string;
  run: (editor: Editor) => void;
};

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  {
    label: "Bold",
    icon: Bold,
    activeName: "bold",
    run: (editor) => editor.chain().focus().toggleBold().run(),
  },
  {
    label: "Italic",
    icon: Italic,
    activeName: "italic",
    run: (editor) => editor.chain().focus().toggleItalic().run(),
  },
  {
    label: "Underline",
    icon: UnderlineIcon,
    activeName: "underline",
    run: (editor) => editor.chain().focus().toggleUnderline().run(),
  },
  {
    label: "Strikethrough",
    icon: Strikethrough,
    activeName: "strike",
    run: (editor) => editor.chain().focus().toggleStrike().run(),
  },
  {
    label: "Bullet list",
    icon: List,
    activeName: "bulletList",
    run: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    label: "Numbered list",
    icon: ListOrdered,
    activeName: "orderedList",
    run: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    label: "Quote",
    icon: Quote,
    activeName: "blockquote",
    run: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    label: "Undo",
    icon: Undo2,
    run: (editor) => editor.chain().focus().undo().run(),
  },
  {
    label: "Redo",
    icon: Redo2,
    run: (editor) => editor.chain().focus().redo().run(),
  },
];

export function RichTextEditor({
  id,
  value,
  placeholder,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    // Editor dirender setelah mount supaya tidak bentrok dengan SSR.
    immediatelyRender: false,
    // Perlu supaya status aktif tombol toolbar ikut berubah.
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        class: cn(
          "min-h-28 w-full px-3 py-2 text-sm outline-none",
          richTextClass,
        ),
      },
    },
    onUpdate: ({ editor: instance }) =>
      onChange(instance.isEmpty ? "" : instance.getHTML()),
  });

  return (
    <div className="focus-within:border-ring focus-within:ring-ring/50 overflow-hidden rounded-md border border-input shadow-xs transition-[color,box-shadow] focus-within:ring-[3px]">
      <div className="flex flex-wrap gap-1 border-b border-border/60 bg-accent/30 p-1">
        {TOOLBAR_ACTIONS.map((action) => {
          const Icon = action.icon;
          const active = action.activeName
            ? (editor?.isActive(action.activeName) ?? false)
            : false;

          return (
            <button
              key={action.label}
              type="button"
              title={action.label}
              aria-label={action.label}
              aria-pressed={action.activeName ? active : undefined}
              disabled={!editor}
              onClick={() => {
                if (editor) {
                  action.run(editor);
                }
              }}
              className={cn(
                "rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50",
                active && "bg-accent text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>

      <div className="relative">
        <EditorContent editor={editor} />

        {placeholder && (!editor || editor.isEmpty) ? (
          <p className="pointer-events-none absolute left-3 top-2 text-sm text-muted-foreground">
            {placeholder}
          </p>
        ) : null}
      </div>
    </div>
  );
}
