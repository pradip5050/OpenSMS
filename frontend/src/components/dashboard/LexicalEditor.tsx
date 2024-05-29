import { $getRoot, $getSelection } from "lexical";
import React, { useEffect } from "react";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const theme = {};

function onError(error: any) {
  console.error(error);
}

export interface LexicalEditorProps {
  editorState: string;
}

const EditorCapturePlugin = React.forwardRef((props: any, ref: any) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    ref.current = editor;
    return () => {
      ref.current = null;
    };
  }, [editor, ref]);

  return null;
});

// TODO: Fix the broken rich text
// https://codesandbox.io/p/sandbox/purple-water-xf50bi?file=%2Fsrc%2FApp.tsx
const LexicalEditor = React.forwardRef((props, ref) => {
  const initialConfig = {
    namespace: "MyEditor",
    // editorState,
    theme,
    onError,
  };

  return (
    <div className="border border-1">
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<></>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <EditorCapturePlugin ref={ref} />
        <HistoryPlugin />
        <AutoFocusPlugin />
      </LexicalComposer>
    </div>
  );
});

EditorCapturePlugin.displayName = "EditorCapturePlugin";
LexicalEditor.displayName = "LexicalEditor";
export default LexicalEditor;
