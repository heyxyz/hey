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
import { select, t, Trans } from '@lingui/macro';
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

const clearSelectedRound = (selectedQuadraticRound: QuadraticRound) => {
  selectedQuadraticRound.name = '';
  selectedQuadraticRound.description = '';
  selectedQuadraticRound.id = '';
  selectedQuadraticRound.token = '';
  selectedQuadraticRound.requirements = [];
};
const notificationStyles =
  'color:#eae2fc;background-color:#7c3aed;border-radius:200px;padding:1px 5px 1px 5px';

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
        notification?.remove();
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
          toast.success('your post has been added to a round');
        });
      } else {
        // This needs to be updated to remove the node if seletecQuadraticRound is empty
        editor.update(() => {
          const textNodes = $getRoot().getAllTextNodes();
          for (const node of textNodes) {
            if (
              notificationKeys.current.find((key: string) => {
                if (key) {
                  return key == node.getKey();
                }
              }) ||
              node.getTextContent().includes('#ethccreq1')
            ) {
              node.remove();
            }
          }
          notificationKeys.current = [];
          toast.error('Your post has been removed from the round.');
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
            const notificationNodes = $getRoot()
              .getAllTextNodes()
              .filter((node) =>
                notificationKeys.current.find((key) => {
                  if (key) {
                    return node.getKey() == key;
                  }
                })
              );
            console.log(
              notificationNodes,
              notificationKeys.current,
              $getRoot().getAllTextNodes(),
              selectedQuadraticRound
            );
            if (notificationNodes.length == 0 && selectedQuadraticRound.id !== '') {
              clearSelectedRound(selectedQuadraticRound);
            }
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
