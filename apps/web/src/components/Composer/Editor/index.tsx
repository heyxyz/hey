import MentionsPlugin from '@components/Shared/Lexical/Plugins/AtMentionsPlugin';
import LexicalAutoLinkPlugin from '@components/Shared/Lexical/Plugins/AutoLinkPlugin';
import EmojiPickerPlugin from '@components/Shared/Lexical/Plugins/EmojiPicker';
import EmojisPlugin from '@components/Shared/Lexical/Plugins/EmojisPlugin';
import ImagesPlugin from '@components/Shared/Lexical/Plugins/ImagesPlugin';
import ToolbarPlugin from '@components/Shared/Lexical/Plugins/ToolbarPlugin';
import useUploadAttachments from '@components/utils/hooks/useUploadAttachments';
import {
  $convertToMarkdownString,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS
} from '@lexical/markdown';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { t, Trans } from '@lingui/macro';
import Errors from 'data/errors';
import type { LexicalEditor, TextNode } from 'lexical';
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { usePublicationStore } from 'src/store/publication';

import type { QuadraticRound } from '../NewPublication';

const TRANSFORMERS = [...TEXT_FORMAT_TRANSFORMERS, ...TEXT_MATCH_TRANSFORMERS];

interface Props {
  selectedQuadraticRound: QuadraticRound;
  editor: LexicalEditor;
  notificationKeys: string[];
  setNotificationKeys: Dispatch<SetStateAction<string[]>>;
}
const findNode = (nodeArray: TextNode[], keyArray: string[]) => {
  return nodeArray.find((node) => {
    return keyArray.find((key: string) => {
      return key == node.getKey();
    });
  });
};
//#8B5CF6 #eae2fc
const notificationStyles =
  'color:#eae2fc;background-color:#8B5CF6;border-radius:8px;font-size:15px;padding:5px 3px 3px 5px;white-space:pre;word-spacing:-.2ch;overflow:hidden;text-size:6px;bottom: 1px;left:1px;';

const Editor: FC<Props> = ({ selectedQuadraticRound, editor, notificationKeys, setNotificationKeys }) => {
  const publicationContent = usePublicationStore((state) => state.publicationContent);
  const setPublicationContent = usePublicationStore((state) => state.setPublicationContent);
  const showNewPostModal = usePublicationStore((state) => state.showNewPostModal);
  const attachments = usePublicationStore((state) => state.attachments);
  const { handleUploadAttachments } = useUploadAttachments();
  const prevQuadraticRoundRef = useRef('');
  const prevQuadraticRequirementsRef = useRef<string[]>([]);
  // const notificationKeys = useRef<string[]>([]);

  const handlePaste = async (pastedFiles: FileList) => {
    if (attachments.length === 4 || attachments.length + pastedFiles.length > 4) {
      return toast.error(t`Please choose either 1 video or up to 4 photos.`);
    }

    if (pastedFiles) {
      await handleUploadAttachments(pastedFiles);
    }
  };

  useEffect(() => {
    if (showNewPostModal == false) {
      editor.update(() => {
        const root = $getRoot();
        const notification = findNode(root.getAllTextNodes(), notificationKeys);
        notification?.remove();
        setNotificationKeys([]);
      });
    }
  }, [showNewPostModal]);

  useEffect(() => {
    prevQuadraticRoundRef.current = selectedQuadraticRound.id;
    prevQuadraticRequirementsRef.current = selectedQuadraticRound.requirements;
  }, []);

  useEffect(() => {
    const prevQuadraticRound = prevQuadraticRoundRef;
    if (selectedQuadraticRound.id !== prevQuadraticRound.current) {
      let newNotification: string;

      if (selectedQuadraticRound.id !== '' && !editor.getEditorState().isEmpty()) {
        newNotification = `Your post will be included in ${selectedQuadraticRound.name} at address ${selectedQuadraticRound.id}.`;

        editor.update(() => {
          const root = $getRoot();
          if (notificationKeys.length > 0) {
            const notificationNode = findNode(root.getAllTextNodes(), notificationKeys);
            const newTextNode = $createTextNode(newNotification)
              .setMode('token')
              .setStyle(notificationStyles);
            notificationKeys.splice(
              notificationKeys.findIndex((key) => key == notificationNode?.getKey()),
              1
            );
            notificationKeys.push(newTextNode.getKey());
            notificationNode?.replace(newTextNode);
          } else {
            const p = $createParagraphNode();
            const textNode = $createTextNode(newNotification).setMode('token').setStyle(notificationStyles);
            notificationKeys.push(textNode.getKey());
            p.append(textNode);
            root.append(p);
          }
          toast.success('Your post has been added to a round.');
        });
      } else {
        editor.update(() => {
          const textNodes = $getRoot().getAllTextNodes();
          for (const node of textNodes) {
            if (
              notificationKeys.find((key: string) => {
                if (key) {
                  return key == node.getKey();
                }
              }) ||
              prevQuadraticRequirementsRef.current.includes(node.getTextContent())
            ) {
              node.remove();
            }
          }
          setNotificationKeys([]);
        });
      }
      prevQuadraticRoundRef.current = selectedQuadraticRound.id;
      prevQuadraticRequirementsRef.current = selectedQuadraticRound.requirements;
    }
  }, [
    selectedQuadraticRound,
    editor,
    publicationContent,
    setPublicationContent,
    notificationKeys,
    setNotificationKeys
  ]);

  return (
    <div className="relative">
      <EmojiPickerPlugin />
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={<ContentEditable className="my-4 block min-h-[65px] overflow-auto px-5" />}
        placeholder={
          <div className="pointer-events-none absolute top-[65px] whitespace-nowrap px-5 text-gray-400">
            <Trans>What's happening?</Trans>
          </div>
        }
        ErrorBoundary={() => <div>{Errors.SomethingWentWrong}</div>}
      />

      <OnChangePlugin
        onChange={(editorState) => {
          editorState.read(() => {
            const markdown = $convertToMarkdownString(TRANSFORMERS);
            setPublicationContent(markdown);
          });
        }}
      />
      <EmojisPlugin />
      <LexicalAutoLinkPlugin />
      <HistoryPlugin />
      <HashtagPlugin />
      <MentionsPlugin />
      <ImagesPlugin onPaste={handlePaste} />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
    </div>
  );
};

export default Editor;
