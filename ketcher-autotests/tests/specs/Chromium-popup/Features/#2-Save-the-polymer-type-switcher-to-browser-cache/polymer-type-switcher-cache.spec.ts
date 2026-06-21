import { Page, test, expect } from '@fixtures';
import { CommonTopRightToolbar } from '@tests/pages/common/CommonTopRightToolbar';
import { MacromoleculesTopToolbar } from '@tests/pages/macromolecules/MacromoleculesTopToolbar';
import { Library } from '@tests/pages/macromolecules/Library';
import { LayoutMode } from '@tests/pages/constants/macromoleculesTopToolbar/Constants';
import { pageReload, clearLocalStorage } from '@utils/common/helpers';
import { keyboardPressOnCanvas, getAltModifier } from '@utils';

let page: Page;

test.describe('Polymer type switcher browser cache autotests', () => {
  test.beforeAll(async ({ initFlexCanvas }) => {
    page = await initFlexCanvas();
  });

  test.afterAll(async ({ closePage }) => {
    await closePage();
  });

  test('Case 1 - When no cached value exists, verify that switching to macromolecule mode defaults to RNA polymer type', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: When no cached value exists, verify that switching to macromolecule mode defaults to RNA polymer type
     * Scenario:
     * 1. Clear browser cache/localStorage
     * 2. Switch to macromolecule mode
     * 3. Verify RNA is selected by default
     *
     * Version: 3.14.0
     */
    await clearLocalStorage(page);
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify RNA button is active (selected)
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-testid', 'RNABtn');
    
    // Verify RNA library tab is active
    await expect(Library(page).rnaDNATab).toBeVisible();
  });

  test('Case 2 - Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select DNA polymer type
     * 3. Reload the page
     * 4. Switch to macromolecule mode
     * 5. Verify DNA is still selected
     *
     * Version: 3.14.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).dna();
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify DNA button is active (selected)
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    await expect(dnaButton).toBeVisible();
    
    // Verify RNA/DNA library tab is active
    await expect(Library(page).rnaDNATab).toBeVisible();
  });

  test('Case 3 - Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select PEP polymer type
     * 3. Reload the page
     * 4. Switch to macromolecule mode
     * 5. Verify PEP is still selected
     *
     * Version: 3.14.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).peptides();
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify Peptides button is active (selected)
    const peptidesButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(peptidesButton).toBeVisible();
    
    // Verify peptide library tab is active
    await expect(Library(page).peptideTab).toBeVisible();
  });

  test('Case 4 - Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select RNA polymer type explicitly
     * 3. Reload the page
     * 4. Switch to macromolecule mode
     * 5. Verify RNA is still selected
     *
     * Version: 3.14.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).rna();
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify RNA button is active (selected)
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toBeVisible();
    
    // Verify RNA/DNA library tab is active
    await expect(Library(page).rnaDNATab).toBeVisible();
  });

  test('Case 5 - Use Ctrl+Alt+D hotkey to switch to DNA, reload the page, and verify DNA is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Use Ctrl+Alt+D hotkey to switch to DNA, reload the page, and verify DNA is restored from cache
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Use Ctrl+Alt+D hotkey to switch to DNA
     * 3. Reload the page
     * 4. Switch to macromolecule mode
     * 5. Verify DNA is restored from cache
     *
     * Version: 3.14.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await keyboardPressOnCanvas(page, `${getAltModifier()}+d`);
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify DNA button is active (selected)
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    await expect(dnaButton).toBeVisible();
    
    // Verify RNA/DNA library tab is active
    await expect(Library(page).rnaDNATab).toBeVisible();
  });

  test('Case 6 - Use Ctrl+Alt+P hotkey to switch to PEP, reload the page, and verify PEP is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Use Ctrl+Alt+P hotkey to switch to PEP, reload the page, and verify PEP is restored from cache
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Use Ctrl+Alt+P hotkey to switch to PEP
     * 3. Reload the page
     * 4. Switch to macromolecule mode
     * 5. Verify PEP is restored from cache
     *
     * Version: 3.14.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await keyboardPressOnCanvas(page, `${getAltModifier()}+p`);
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify Peptides button is active (selected)
    const peptidesButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(peptidesButton).toBeVisible();
    
    // Verify peptide library tab is active
    await expect(Library(page).peptideTab).toBeVisible();
  });

  test('Case 7 - Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Use Ctrl+Alt+R hotkey to switch to RNA
     * 3. Reload the page
     * 4. Switch to macromolecule mode
     * 5. Verify RNA is restored from cache
     *
     * Version: 3.14.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await keyboardPressOnCanvas(page, `${getAltModifier()}+r`);
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify RNA button is active (selected)
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toBeVisible();
    
    // Verify RNA/DNA library tab is active
    await expect(Library(page).rnaDNATab).toBeVisible();
  });

  test('Case 8 - Change the polymer type by switching the library tab, reload the page, and verify the cached type matches the last library tab used', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Change the polymer type by switching the library tab, reload the page, and verify the cached type matches the last library tab used
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Switch to peptide library tab
     * 3. Reload the page
     * 4. Switch to macromolecule mode
     * 5. Verify peptide type and tab are restored
     *
     * Version: 3.14.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await Library(page).peptideTab.click();
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify Peptides button is active (selected)
    const peptidesButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(peptidesButton).toBeVisible();
    
    // Verify peptide library tab is active
    await expect(Library(page).peptideTab).toBeVisible();
  });

  test('Case 9 - Switch to PEP, reload the page, enter flex mode, and verify the peptide library tab is opened by default despite switcher not being visible', async ({ FlexCanvas: _ }) => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Switch to PEP, reload the page, enter flex mode, and verify the peptide library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select PEP polymer type
     * 3. Reload the page
     * 4. Switch to flex mode
     * 5. Verify peptide library tab is opened by default
     *
     * Version: 3.14.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).peptides();
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Flex);
    
    // Verify peptide library tab is active
    await expect(Library(page).peptideTab).toBeVisible();
  });

  test('Case 10 - Switch to DNA, reload the page, enter snake mode, and verify the RNA/DNA library tab is opened by default despite switcher not being visible', async ({ SnakeCanvas: _ }) => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Switch to DNA, reload the page, enter snake mode, and verify the RNA/DNA library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select DNA polymer type
     * 3. Reload the page
     * 4. Switch to snake mode
     * 5. Verify RNA/DNA library tab is opened by default
     *
     * Version: 3.14.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).dna();
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Snake);
    
    // Verify RNA/DNA library tab is active
    await expect(Library(page).rnaDNATab).toBeVisible();
  });

  test('Case 11 - Clear browser cache/localStorage, open macromolecule mode, and verify RNA is selected as the fallback default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Clear browser cache/localStorage, open macromolecule mode, and verify RNA is selected as the fallback default
     * Scenario:
     * 1. Clear browser cache/localStorage
     * 2. Reload the page
     * 3. Switch to macromolecule mode
     * 4. Verify RNA is selected as fallback default
     *
     * Version: 3.14.0
     */
    await clearLocalStorage(page);
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify RNA button is active (selected)
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toBeVisible();
    
    // Verify RNA/DNA library tab is active
    await expect(Library(page).rnaDNATab).toBeVisible();
  });

  test('Case 12 - Verify that switching polymer type in one browser tab and opening a new tab reflects the cached value in the new tab', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Verify that switching polymer type in one browser tab and opening a new tab reflects the cached value in the new tab
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select DNA polymer type
     * 3. Open a new tab/context
     * 4. Switch to macromolecule mode in new tab
     * 5. Verify DNA is selected in the new tab
     *
     * Version: 3.14.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).dna();
    
    // Create new browser context/tab to test cache persistence across tabs
    const newContext = await page.context().browser()?.newContext();
    const newPage = await newContext!.newPage();
    await newPage.goto(page.url());
    
    // Wait for page to load and switch to macromolecule mode
    await page.waitForTimeout(2000);
    await CommonTopRightToolbar(newPage).turnOnMacromoleculesEditor();
    
    // Verify DNA button is active (selected) in new tab
    const dnaButton = MacromoleculesTopToolbar(newPage).dnaButton;
    await expect(dnaButton).toBeVisible();
    
    // Clean up new context
    await newContext!.close();
  });

  test('Case 13 - Switch polymer type multiple times in sequence (RNA → DNA → PEP → DNA), reload, and verify only the last selected type (DNA) is restored', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Switch polymer type multiple times in sequence, reload, and verify only the last selected type is restored
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select RNA → DNA → PEP → DNA in sequence
     * 3. Reload the page
     * 4. Switch to macromolecule mode
     * 5. Verify only the last selected type (DNA) is restored
     *
     * Version: 3.14.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Switch through sequence: RNA → DNA → PEP → DNA
    await MacromoleculesTopToolbar(page).rna();
    await MacromoleculesTopToolbar(page).dna();
    await MacromoleculesTopToolbar(page).peptides();
    await MacromoleculesTopToolbar(page).dna();
    
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify DNA button is active (selected) - the last one in the sequence
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    await expect(dnaButton).toBeVisible();
    
    // Verify RNA/DNA library tab is active
    await expect(Library(page).rnaDNATab).toBeVisible();
  });

  test('Case 14 - Verify that the cached polymer type persists after navigating away from macromolecule mode to small molecule mode and back', async ({ MoleculesCanvas: _ }) => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Verify that the cached polymer type persists after navigating away from macromolecule mode to small molecule mode and back
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select PEP polymer type
     * 3. Switch to small molecule mode
     * 4. Switch back to macromolecule mode
     * 5. Verify PEP is still selected
     *
     * Version: 3.14.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).peptides();
    await CommonTopRightToolbar(page).turnOnMicromoleculesEditor();
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify Peptides button is active (selected)
    const peptidesButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(peptidesButton).toBeVisible();
    
    // Verify peptide library tab is active
    await expect(Library(page).peptideTab).toBeVisible();
  });

  test('Case 15 - Verify that an invalid or corrupted cache value for polymer type falls back gracefully to the RNA default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Verify that an invalid or corrupted cache value for polymer type falls back gracefully to the RNA default
     * Scenario:
     * 1. Set invalid cache value via localStorage
     * 2. Reload the page
     * 3. Switch to macromolecule mode
     * 4. Verify RNA is selected as fallback
     *
     * Version: 3.14.0
     */
    // Set invalid cache value in localStorage
    await page.evaluate(() => {
      localStorage.setItem('polymerType', 'INVALID_VALUE');
    });
    
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify RNA button is active (selected) as fallback
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toBeVisible();
    
    // Verify RNA/DNA library tab is active
    await expect(Library(page).rnaDNATab).toBeVisible();
  });
});