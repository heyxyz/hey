import MentionsPlugin from '@components/Shared/Lexical/Plugins/AtMentionsPlugin';
import LexicalAutoLinkPlugin from '@components/Shared/Lexical/Plugins/AutoLinkPlugin';
import EmojiPickerPlugin from '@components/Shared/Lexical/Plugins/EmojiPicker';
import EmojisPlugin from '@components/Shared/Lexical/Plugins/EmojisPlugin';
import ImagesPlugin from '@components/Shared/Lexical/Plugins/ImagesPlugin';
import ToolbarPlugin from '@components/Shared/Lexical/Plugins/ToolbarPlugin';
import useUploadAttachments from '@components/utils/hooks/useUploadAttachments';
import { $convertToMarkdownString, TEXT_FORMAT_TRANSFORMERS } from '@lexical/markdown';
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
import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { usePublicationStore } from 'src/store/publication';

import type { QuadraticRound } from '../NewPublication';

const TRANSFORMERS = [...TEXT_FORMAT_TRANSFORMERS];

interface Props {
  selectedQuadraticRound: QuadraticRound;
  editor: LexicalEditor;
}
const findNode = (nodeArray: TextNode[], keyArray: string[]) => {
  return nodeArray.find((node) => {
    return keyArray.find((key: string) => {
      return key == node.getKey();
    });
  });
};
const notificationStyles = 'color:#a855f7;background-color:#d1a8fd;border:solid; #a855f7;border-width:2px;border-radius:200px;padding-left:5px;padding-right:5px;';

const Editor: FC<Props> = ({ selectedQuadraticRound, editor }) => {
  const publicationContent = usePublicationStore((state) => state.publicationContent);
  const setPublicationContent = usePublicationStore((state) => state.setPublicationContent);
  const showNewPostModal = usePublicationStore((state) => state.showNewPostModal);
  const attachments = usePublicationStore((state) => state.attachments);
  const { handleUploadAttachments } = useUploadAttachments();
  const prevQuadraticRoundRef = useRef('');
  const notificationKeys = useRef<string[]>([]);

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
        const notification = findNode(root.getAllTextNodes(), notificationKeys.current);
        notification?.replace($createTextNode(''));
        notificationKeys.current = [];
      });
    }
  }, [showNewPostModal]);

  useEffect(() => {
    prevQuadraticRoundRef.current = selectedQuadraticRound.id;
  }, []);

  useEffect(() => {
    const prevQuadraticRound = prevQuadraticRoundRef.current;

    if (selectedQuadraticRound.id !== prevQuadraticRound) {
      let newNotification: string;

      if (selectedQuadraticRound.id !== '') {
        newNotification = `Your post will be included in the ${selectedQuadraticRound.id} round.`;

        editor.update(() => {
          const root = $getRoot();
          if (notificationKeys.current.length > 0) {
            const notificationNode = findNode(root.getAllTextNodes(), notificationKeys.current);
            const newTextNode = $createTextNode(newNotification)
              .setMode('token')
              .setStyle(notificationStyles);
            notificationKeys.current.push(newTextNode.getKey());
            notificationNode?.replace(newTextNode);
          } else {
            const p = $createParagraphNode();
            const textNode = $createTextNode(newNotification).setMode('token').setStyle(notificationStyles);
            notificationKeys?.current.push(textNode.getKey());
            p.append(textNode);
            root.append(p);
          }
        });
      } else {
        // This needs to be updated to remove the node if seletecQuadraticRound is empty
        editor.update(() => {
          const textNodes = $getRoot().getAllTextNodes();
          for (const node of textNodes) {
            if (
              notificationKeys.current.find((key: string) => {
                return key == node.getKey();
              })
            ) {
              node.replace($createTextNode());
              notificationKeys.current = [];
            }
          }
        });
      }

      prevQuadraticRoundRef.current = selectedQuadraticRound.id;
    }
  }, [selectedQuadraticRound, editor, publicationContent, setPublicationContent]);

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
