import react from '@vitejs/plugin-react-swc';
import * as dotenv from 'dotenv';
import path from 'path';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [nodePolyfills(), react()],
    resolve: {
      alias: {
        '@lib': path.resolve(__dirname, './src/lib'),
        '@gql': path.resolve(__dirname, './src/gql'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@store': path.resolve(__dirname, './src/store'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@enums': path.resolve(__dirname, './src/enums'),
        '@constants': path.resolve(__dirname, './src/constants'),
        '@generated': path.resolve(__dirname, './src/generated'),
        '@components': path.resolve(__dirname, './src/components'),
        '@persisted': path.resolve(__dirname, './src/store/persisted')
      }
    },
    define: {
      global: {},
      'process.env': process.env,
      'process.env.NEXT_PUBLIC_LENS_NETWORK': `'${process.env.NEXT_PUBLIC_LENS_NETWORK}'`,
      'process.env.NEXT_PUBLIC_IS_PRODUCTION': `'${process.env.NEXT_PUBLIC_IS_PRODUCTION}'`
    },
    server: {
      open: true,
      port: 4783,
      host: '0.0.0.0'
    },
    preview: {
      open: true,
      port: 4783,
      host: '0.0.0.0'
    },
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: 'chunk-[name].[hash].js',
          entryFileNames: 'entry-[name].[hash].js',
          manualChunks: {
            react: [
              'react',
              'react-dom',
              'react-helmet',
              'react-virtuoso',
              'react-hot-toast',
              'react-router-dom',
              'react-cool-inview',
              '@headlessui/react',
              'react-device-detect',
              'react-activity-calendar'
            ],
            hey_ui: ['@heroicons/react/24/solid', '@hey/ui'],
            hey_lib: [
              '@hey/lib/truncateUrl',
              '@hey/lib/truncateByWords',
              '@hey/lib/trimify',
              '@hey/lib/stopEventPropagation',
              '@hey/lib/splitNumber',
              '@hey/lib/sanitizeDisplayName',
              '@hey/lib/sanitizeDStorageUrl',
              '@hey/lib/resolveEns',
              '@hey/lib/removeUrlsByHostnames',
              '@hey/lib/removeUrlAtEnd',
              '@hey/lib/removeQuoteOn',
              '@hey/lib/publicationHelpers',
              '@hey/lib/parseJwt',
              '@hey/lib/nFormatter',
              '@hey/lib/isPublicationMetadataTypeAllowed',
              '@hey/lib/isPrideMonth',
              '@hey/lib/isOpenActionAllowed',
              '@hey/lib/imageKit',
              '@hey/lib/humanize',
              '@hey/lib/hasMisused',
              '@hey/lib/getZoraChainInfo',
              '@hey/lib/getWalletDetails',
              '@hey/lib/getUniswapURL',
              '@hey/lib/getURLs',
              '@hey/lib/getTokenImage',
              '@hey/lib/getStampFyiURL',
              '@hey/lib/getSignature',
              '@hey/lib/getRedstonePrice',
              '@hey/lib/getPublicationsViews',
              '@hey/lib/getPublicationViewCountById',
              '@hey/lib/getPublicationIds',
              '@hey/lib/getPublicationData',
              '@hey/lib/getPublicationAttribute',
              '@hey/lib/getProfileAttribute',
              '@hey/lib/getProfile',
              '@hey/lib/getOpenActionModuleData',
              '@hey/lib/getOpenActionActOnKey',
              '@hey/lib/getMisuseDetails',
              '@hey/lib/getMentions',
              '@hey/lib/getFollowModule',
              '@hey/lib/getFileFromDataURL',
              '@hey/lib/getFavicon',
              '@hey/lib/getAvatar',
              '@hey/lib/getAttachmentsData',
              '@hey/lib/getAssetSymbol',
              '@hey/lib/getAppName',
              '@hey/lib/getAlgorithmicFeed',
              '@hey/lib/generateVideoThumbnails',
              '@hey/lib/formatAddress',
              '@hey/lib/downloadJson',
              '@hey/lib/collectModuleParams',
              '@hey/lib/checkDispatcherPermissions'
            ],
            shared_components: [
              '@components/Shared/WalletProfile',
              '@components/Shared/Video',
              '@components/Shared/UserProfile',
              '@components/Shared/UserPreview',
              '@components/Shared/ToggleWithHelper',
              '@components/Shared/SwitchProfiles',
              '@components/Shared/SwitchNetwork',
              '@components/Shared/SmallWalletProfile',
              '@components/Shared/SmallUserProfile',
              '@components/Shared/Slug',
              '@components/Shared/SingleNft',
              '@components/Shared/Sidebar',
              '@components/Shared/SettingsHelper',
              '@components/Shared/SearchUser',
              '@components/Shared/PublicationWrapper',
              '@components/Shared/ProtectProfile',
              '@components/Shared/Profiles',
              '@components/Shared/NotLoggedIn',
              '@components/Shared/NewAttachments',
              '@components/Shared/MenuTransition',
              '@components/Shared/Loading',
              '@components/Shared/Loader',
              '@components/Shared/IndexStatus',
              '@components/Shared/ImageCropperController',
              '@components/Shared/GroupProfile',
              '@components/Shared/GlobalModals',
              '@components/Shared/GlobalBanners',
              '@components/Shared/GlobalAlerts',
              '@components/Shared/GetOpenActionModuleIcon',
              '@components/Shared/Footer',
              '@components/Shared/FeedFocusType',
              '@components/Shared/FallbackProfileName',
              '@components/Shared/DismissRecommendedProfile',
              '@components/Shared/CountdownTimer',
              '@components/Shared/CommentWarning',
              '@components/Shared/CollectWarning',
              '@components/Shared/ChooseFile',
              '@components/Shared/Attachments',
              '@components/Shared/Shimmer/PublicationsShimmer',
              '@components/Settings/Allowance/Button'
            ]
          }
        }
      }
    }
  };
});
