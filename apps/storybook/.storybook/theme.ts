import { create } from '@storybook/theming/create';

export default create({
  base: 'dark',
  brandTitle: `
    <div style="display: flex; gap: 10px; align-items: center;">
      <img src="https://lenster.xyz/logo.svg" alt="Lenster" style="height: 30px; width: 30px;" />
      <h3 style="font-weight: bold;">Design</h3>
    </div>
  `
});
