import { Underline } from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Button, message } from 'antd';
import { useCallback, useState } from "react";
import { MdFormatListBulleted } from "react-icons/md";
import { VscListOrdered } from "react-icons/vsc";

const ClientTermCondition = () => {
  const [description, setDescription] = useState("<p></p>");
  const [wordCount, setWordCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Utility function to count words
  const countWords = useCallback((html) => {
    if (!html) return 0;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";
    const words = plainText
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    return words.length;
  }, []);

  // Function to truncate content to 1000 words
  const truncateTo1000Words = useCallback((html) => {
    if (!html) return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";
    const words = plainText.trim().split(/\s+/);
    if (words.length <= 1000) return html;

    return words.slice(0, 1000).join(" ") + "... [content truncated]";
  }, []);

  // Handle save button click (demo version)
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success("Terms and conditions saved successfully!");
    } catch (err) {
      message.error("Failed to save terms and conditions");
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Tiptap Editor Setup
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          HTMLAttributes: {
            class: "list-disc pl-5",
          },
        },
        orderedList: {
          keepMarks: true,
          HTMLAttributes: {
            class: "list-decimal pl-5",
          },
        },
      }),
      Underline,
    ],
    content: description,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const words = countWords(html);

      if (words > 1000) {
        const truncatedHtml = truncateTo1000Words(html);
        editor.commands.setContent(truncatedHtml);
        setWordCount(1000);
        setDescription(truncatedHtml);
        message.warning("Word limit of 1000 exceeded. Content has been truncated.");
      } else {
        setDescription(html);
        setWordCount(words);
      }
    },
    editorProps: {
      attributes: {
        class: `focus:outline-none p-4 min-h-[240px] max-h-[240px] overflow-y-auto bg-white text-gray-800`,
      },
      handlePaste: (view, event) => {
        const html = event.clipboardData?.getData("text/html");
        const text = event.clipboardData?.getData("text/plain");

        if (html || text) {
          const currentWordCount = countWords(editor.getHTML());
          const pastedWordCount = countWords(html || text);

          if (currentWordCount + pastedWordCount > 1000) {
            event.preventDefault();
            message.warning(
              `Pasting this content would exceed the 1000 word limit. You have ${1000 - currentWordCount
              } words remaining.`
            );
            return true;
          }
        }
        return false;
      },
    },
  });

  return (
    <div className="w-full mt-5">
      <div className="rounded-xl shadow-lg border-2 overflow-hidden bg-white border-gray-200">
        <div className="py-4 sm:p-6 bg-gray-50">
          <div className="mb-6 sm:mb-8">
            <div className="flex justify-between items-center mb-2">
              <div className={`text-sm font-medium ${wordCount > 900 ? "text-red-500" :
                wordCount > 800 ? "text-yellow-500" :
                  "text-gray-600"
                }`}>
                {wordCount}/1000 words
              </div>
            </div>

            <div className="tiptap-editor-wrapper border border-gray-300">
              {/* Toolbar */}
              <div className="flex gap-1 px-1 py-2 border-b bg-gray-50 border-gray-200">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`px-4 py-2 cursor-pointer rounded ${editor?.isActive("bold") ? "bg-blue-700 text-white" : "hover:bg-gray-200"
                    }`}
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`px-[18px] py-2 cursor-pointer rounded ${editor?.isActive("italic") ? "bg-blue-700 text-white" : "hover:bg-gray-200"
                    }`}
                >
                  <em>I</em>
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  className={`px-4 py-2 cursor-pointer rounded ${editor?.isActive("underline") ? "bg-blue-700 text-white" : "hover:bg-gray-200"
                    }`}
                >
                  <u>U</u>
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={`px-3 py-2 cursor-pointer rounded ${editor?.isActive("bulletList") ? "bg-blue-700 text-white" : "hover:bg-gray-200"
                    }`}
                >
                  <MdFormatListBulleted size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  className={`px-3 py-2 cursor-pointer rounded ${editor?.isActive("orderedList") ? "bg-blue-700 text-white" : "hover:bg-gray-200"
                    }`}
                >
                  <VscListOrdered size={20} />
                </button>
              </div>

              {/* Editor */}
              <EditorContent editor={editor} />
            </div>
          </div>

          <Button
            type="primary"
            onClick={handleSave}
            loading={isSaving}
          >
            Save Terms and conditions
          </Button>
        </div>
      </div>

      <style jsx global>{`
        .tiptap-editor-wrapper .ProseMirror {
          padding: 1rem;
          min-height: 400px;
          outline: none;
          line-height: 1.6;
        }
        .tiptap-editor-wrapper .ProseMirror::-webkit-scrollbar {
          width: 8px;
        }
        .tiptap-editor-wrapper .ProseMirror::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .tiptap-editor-wrapper .ProseMirror::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .tiptap-editor-wrapper .ProseMirror::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default ClientTermCondition;