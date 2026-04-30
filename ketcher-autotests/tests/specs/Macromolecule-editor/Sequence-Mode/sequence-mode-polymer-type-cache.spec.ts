import { Page, test, expect } from '@fixtures';
import { MacromoleculesTopToolbar } from '@tests/pages/macromolecules/MacromoleculesTopToolbar';
import { LayoutMode } from '@tests/pages/constants/macromoleculesTopToolbar/Constants';
import { takeTopToolbarScreenshot, pageReload, clearLocalStorage } from '@utils';

let page: Page;

test.describe('Autotests: Save polymer type switcher to browser cache', () => {
  test.beforeAll(async ({ initFlexCanvas }) => {
    page = await initFlexCanvas();
  });

  test.afterAll(async ({ closePage }) => {
    await closePage();
  });

  test.afterEach(async ({ FlexCanvas: _ }) => {});

  test('Case 1 - When no cached value exists, verify that switching to macromolecule mode defaults to RNA polymer type', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/5
     * Description: When no cached value exists, verify that switching to macromolecule mode defaults to RNA polymer type
     * Scenario:
     * 1. Clear localStorage to ensure no cached value exists
     * 2. Reload page and wait for initialization
     * 3. Switch to Sequence mode where RNA/DNA/PEP buttons are visible
     * 4. Verify that RNA is the default selected polymer type
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
     * 3. Reload page and wait for initialization
     * 4. Switch back to Sequence mode
     * 5. Verify that DNA is still selected after page reload
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
     * 3. Reload page and wait for initialization
     * 4. Switch back to Sequence mode
     * 5. Verify that PEP is still selected after page reload
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
     * 2. First select DNA to change from default
     * 3. Then select RNA explicitly
     * 4. Reload page and wait for initialization
     * 5. Switch back to Sequence mode
     * 6. Verify that RNA is still selected after page reload
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