import dynamic from 'next/dynamic';

// Don't render the editor on the server because some parts of it depend on the browser API.
const DynamicTextEditor = dynamic(() => import('./TextEditor'), { ssr: false });

export default DynamicTextEditor;
