/* eslint-disable no-magic-numbers */
import { test, Page } from '@fixtures';
import { takeTopToolbarScreenshot } from '@utils';
import {
  pageReload,
  clearLocalStorage,
} from '@utils/common/helpers';
import { MacromoleculesTopToolbar } from '@tests/pages/macromolecules/MacromoleculesTopToolbar';
import { LayoutMode } from '@tests/pages/constants/macromoleculesTopToolbar/Constants';

let page: Page;

test.beforeAll(async ({ initFlexCanvas }) => {
  page = await initFlexCanvas();
});

test.afterAll(async ({ closePage }) => {
  await closePage();
});

test.beforeEach(async ({ FlexCanvas: _ }) => {});

test.describe('Sequence Mode - Polymer Type Switcher Cache', () => {
  test('Case 1 - When no cached value exists, macromolecule mode defaults to RNA polymer type', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/5
     * Description: When no cached value exists, verify that switching to macromolecule mode
     * defaults to RNA polymer type
     * Scenario:
     * 1. Clear localStorage to ensure no cached polymer type exists
     * 2. Reload the page
     * 3. Switch to macromolecule mode
     * 4. Switch to Sequence layout mode
     * 5. Verify RNA polymer type is selected by default
     *
     * Version: 3.12.0
     */
    await clearLocalStorage(page);
    await pageReload(page);
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Sequence);
    await takeTopToolbarScreenshot(page);
  });

  test('Case 2 - Select DNA via polymer type switcher, reload the page, verify macromolecule mode reopens with DNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/5
     * Description: Select DNA via the polymer type switcher, reload the page, and verify
     * macromolecule mode reopens with DNA selected
     * Scenario:
     * 1. Switch to Sequence layout mode
     * 2. Select DNA polymer type
     * 3. Reload the page
     * 4. Switch back to macromolecule mode in Sequence layout
     * 5. Verify DNA polymer type is still selected
     *
     * Version: 3.12.0
     */
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Sequence);
    await MacromoleculesTopToolbar(page).dna();
    await pageReload(page);
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Sequence);
    await takeTopToolbarScreenshot(page);
  });

  test('Case 3 - Select PEP via polymer type switcher, reload the page, verify macromolecule mode reopens with PEP selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/5
     * Description: Select PEP via the polymer type switcher, reload the page, and verify
     * macromolecule mode reopens with PEP selected
     * Scenario:
     * 1. Switch to Sequence layout mode
     * 2. Select PEP polymer type
     * 3. Reload the page
     * 4. Switch back to macromolecule mode in Sequence layout
     * 5. Verify PEP polymer type is still selected
     *
     * Version: 3.12.0
     */
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Sequence);
    await MacromoleculesTopToolbar(page).peptides();
    await pageReload(page);
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Sequence);
    await takeTopToolbarScreenshot(page);
  });

  test('Case 4 - Explicitly select RNA via polymer type switcher, reload the page, verify macromolecule mode reopens with RNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/5
     * Description: Select RNA explicitly via the polymer type switcher, reload the page, and
     * verify macromolecule mode reopens with RNA selected
     * Scenario:
     * 1. Switch to Sequence layout mode
     * 2. Select DNA polymer type to change from default
     * 3. Select RNA polymer type explicitly
     * 4. Reload the page
     * 5. Switch back to macromolecule mode in Sequence layout
     * 6. Verify RNA polymer type is still selected
     *
     * Version: 3.12.0
     */
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Sequence);
    await MacromoleculesTopToolbar(page).dna();
    await MacromoleculesTopToolbar(page).rna();
    await pageReload(page);
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Sequence);
    await takeTopToolbarScreenshot(page);
  });
});
