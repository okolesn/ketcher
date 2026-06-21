/* eslint-disable @typescript-eslint/no-empty-function */
import { test, expect, Page } from '@fixtures';
import { MacromoleculesTopToolbar } from '@tests/pages/macromolecules/MacromoleculesTopToolbar';
import { LayoutMode } from '@tests/pages/constants/macromoleculesTopToolbar/Constants';
import { takeTopToolbarScreenshot } from '@utils';
import { pageReload, clearLocalStorage } from '@utils/common/helpers';

let page: Page;

test.beforeAll(async ({ initFlexCanvas }) => {
  page = await initFlexCanvas();
});

test.afterEach(async ({ FlexCanvas: _ }) => {});

test.afterAll(async ({ closePage }) => {
  await closePage();
});

test.describe('Sequence Mode: Polymer type switcher browser cache', () => {
  test('Case 1 - When no cached value exists, verify that switching to macromolecule mode defaults to RNA polymer type', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/5
     * Description: When no cached value exists, verify that switching to macromolecule mode defaults to RNA polymer type
     * Scenario:
     * 1. Clear localStorage to ensure no cached value exists
     * 2. Reload the page
     * 3. Switch to Sequence mode
     * 4. Verify that RNA is the default polymer type selected
     *
     * Version 3.12.0
     */
    await clearLocalStorage(page);
    await pageReload(page);
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Sequence);
    await takeTopToolbarScreenshot(page);
  });

  test('Case 2 - Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/5
     * Description: Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected
     * Scenario:
     * 1. Switch to Sequence mode
     * 2. Select DNA polymer type
     * 3. Reload the page
     * 4. Switch to Sequence mode
     * 5. Verify that DNA is still selected
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Sequence);
    await MacromoleculesTopToolbar(page).dna();
    await pageReload(page);
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Sequence);
    await takeTopToolbarScreenshot(page);
  });

  test('Case 3 - Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/5
     * Description: Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected
     * Scenario:
     * 1. Switch to Sequence mode
     * 2. Select PEP polymer type
     * 3. Reload the page
     * 4. Switch to Sequence mode
     * 5. Verify that PEP is still selected
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Sequence);
    await MacromoleculesTopToolbar(page).peptides();
    await pageReload(page);
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Sequence);
    await takeTopToolbarScreenshot(page);
  });

  test('Case 4 - Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/5
     * Description: Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected
     * Scenario:
     * 1. Switch to Sequence mode
     * 2. Select DNA first, then RNA to explicitly set RNA
     * 3. Reload the page
     * 4. Switch to Sequence mode
     * 5. Verify that RNA is still selected
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Sequence);
    await MacromoleculesTopToolbar(page).dna();
    await MacromoleculesTopToolbar(page).rna();
    await pageReload(page);
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Sequence);
    await takeTopToolbarScreenshot(page);
  });
});