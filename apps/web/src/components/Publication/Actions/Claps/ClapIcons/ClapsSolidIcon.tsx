import React from 'react';

export default function ClapsSolidIcon({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 13 13"
      width={size} // added size here
      height={size} // added size here
      fill={'green'} // added color here
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        d="M12.527 8.63569V2.7906C12.527 2.56579 12.527 2.34098 12.3022 2.11617C12.1898 2.00376 11.965 1.89135 11.7401 1.89135C11.5153 1.89135 10.9533 2.00376 10.9533 2.67819V6.7248L4.9958 0.767299C4.54618 0.317676 4.09656 0.317676 3.87175 0.430082C3.64694 0.654893 3.75934 0.99211 4.20897 1.44173L8.48038 5.71314L7.80594 6.38758L1.84845 0.542487C1.51123 0.092865 1.17401 0.092865 0.949203 0.092865C0.836797 0.092865 0.724392 0.205271 0.724392 0.317676C0.724392 0.542487 0.724392 0.879704 1.17401 1.21692L6.9067 6.94961L6.23227 7.62404L1.06161 2.67819C0.611986 2.22857 0.162364 2.22857 0.049958 2.34098C0.049958 2.34098 -0.0624476 2.56579 0.049958 2.67819C0.049958 2.903 0.162364 3.12782 0.49958 3.35263L5.44543 8.29847L4.77099 8.97291L1.17401 5.37593C0.949203 5.15112 0.611986 4.92631 0.387175 4.92631C0.162364 4.92631 0.387175 4.92631 0.274769 4.92631C0.162364 4.92631 0.049958 5.03871 0.049958 5.15112C0.049958 5.37593 0.049958 5.71315 0.387175 6.05036L5.67024 11.1086C5.67024 11.1086 7.0191 12.5699 8.70519 12.5699C10.3913 12.5699 12.7518 10.9962 12.7518 8.41088L12.527 8.63569Z"
        fill="#36BF66"
      />
    </svg>
  );
}
