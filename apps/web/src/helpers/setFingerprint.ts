import { Localstorage } from "@hey/data/storage";
import { getCurrentBrowserFingerPrint } from "@rajesh896/broprint.js";

const setFingerprint = async () => {
  const storedFingerprint = localStorage.getItem(Localstorage.FingerprintStore);

  if (!storedFingerprint) {
    const fingerprint = await getCurrentBrowserFingerPrint();
    if (fingerprint) {
      localStorage.setItem(Localstorage.FingerprintStore, fingerprint);
    }
  }
};

export default setFingerprint;
