import { Page, test, expect } from '@fixtures';
import { MacromoleculesTopToolbar } from '@tests/pages/macromolecules/MacromoleculesTopToolbar';
import { LayoutMode } from '@tests/pages/constants/macromoleculesTopToolbar/Constants';
import { 
  pageReload,
  clearLocalStorage,
  takeTopToolbarScreenshot,
} from '@utils';

let page: Page;

test.describe('Sequence Mode Polymer Type Cache', () => {
  test.beforeAll(async ({ initFlexCanvas }) => {
    page = await initFlexCanvas();
  });

  test.afterAll(async ({ closePage }) => {
    await closePage();
  });

  test('Case 1 - When no cached value exists, verify that switching to macromolecule mode defaults to RNA polymer type', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/5
     * Description: When no cached value exists, verify that switching to macromolecule mode defaults to RNA polymer type
     * Scenario:
     * 1. Clear localStorage to remove any cached polymer type
     * 2. Reload the page
     * 3. Switch to Sequence mode
     * 4. Verify that RNA is the default selected polymer type
     *
     * Version 3.15.0
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
     * 4. Switch to Sequence mode again
     * 5. Verify that DNA is still selected
     *
     * Version 3.15.0
     */
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Sequence);
    await MacromoleculesTopToolbar(page).dna();
    await takeTopToolbarScreenshot(page);
    
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
     * 2. Select PEP (Peptides) polymer type
     * 3. Reload the page
     * 4. Switch to Sequence mode again
     * 5. Verify that PEP is still selected
     *
     * Version 3.15.0
     */
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Sequence);
    await MacromoleculesTopToolbar(page).peptides();
    await takeTopToolbarScreenshot(page);
    
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
     * 2. Switch to DNA first, then back to RNA to explicitly select RNA
     * 3. Reload the page
     * 4. Switch to Sequence mode again
     * 5. Verify that RNA is still selected
     *
     * Version 3.15.0
     */
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Sequence);
    await MacromoleculesTopToolbar(page).dna(); // Switch to DNA first
    await MacromoleculesTopToolbar(page).rna(); // Then explicitly select RNA
    await takeTopToolbarScreenshot(page);
    
    await pageReload(page);
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Sequence);
    
    await takeTopToolbarScreenshot(page);
  });
});