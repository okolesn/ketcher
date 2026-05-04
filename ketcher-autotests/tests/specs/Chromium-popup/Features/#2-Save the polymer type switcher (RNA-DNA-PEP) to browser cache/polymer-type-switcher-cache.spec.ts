import { Page, test, expect } from '@fixtures';
import { CommonTopRightToolbar } from '@tests/pages/common/CommonTopRightToolbar';
import { MacromoleculesTopToolbar } from '@tests/pages/macromolecules/MacromoleculesTopToolbar';
import { LayoutMode } from '@tests/pages/constants/layoutMode';
import { pageReload, clearLocalStorage } from '@utils/common/helpers';

let page: Page;

test.describe('Autotests: Save the polymer type switcher (RNA/DNA/PEP) to browser cache', () => {
  test.beforeAll(async ({ initMoleculesCanvas }) => {
    page = await initMoleculesCanvas();
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
     * 3. Verify RNA is selected as default
     *
     * Version 3.15.0
     */
    await clearLocalStorage(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify RNA is selected by default
    await expect(MacromoleculesTopToolbar(page).rnaButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('Case 2 - Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select DNA via polymer type switcher
     * 3. Reload the page
     * 4. Verify macromolecule mode reopens with DNA selected
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).dna();
    
    await pageReload(page);
    
    // Verify DNA is selected after reload
    await expect(MacromoleculesTopToolbar(page).dnaButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('Case 3 - Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select PEP via polymer type switcher
     * 3. Reload the page
     * 4. Verify macromolecule mode reopens with PEP selected
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).peptides();
    
    await pageReload(page);
    
    // Verify PEP is selected after reload
    await expect(MacromoleculesTopToolbar(page).peptidesButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('Case 4 - Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select another polymer type first (DNA)
     * 3. Select RNA explicitly via polymer type switcher
     * 4. Reload the page
     * 5. Verify macromolecule mode reopens with RNA selected
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).dna();
    await MacromoleculesTopToolbar(page).rna();
    
    await pageReload(page);
    
    // Verify RNA is selected after reload
    await expect(MacromoleculesTopToolbar(page).rnaButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('Case 5 - Use Ctrl+Alt+D hotkey to switch to DNA, reload the page, and verify DNA is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Use Ctrl+Alt+D hotkey to switch to DNA, reload the page, and verify DNA is restored from cache
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Use Ctrl+Alt+D hotkey to switch to DNA
     * 3. Reload the page
     * 4. Verify DNA is restored from cache
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await page.keyboard.press('Control+Alt+KeyD');
    
    await pageReload(page);
    
    // Verify DNA is selected after reload
    await expect(MacromoleculesTopToolbar(page).dnaButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('Case 6 - Use Ctrl+Alt+P hotkey to switch to PEP, reload the page, and verify PEP is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Use Ctrl+Alt+P hotkey to switch to PEP, reload the page, and verify PEP is restored from cache
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Use Ctrl+Alt+P hotkey to switch to PEP
     * 3. Reload the page
     * 4. Verify PEP is restored from cache
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await page.keyboard.press('Control+Alt+KeyP');
    
    await pageReload(page);
    
    // Verify PEP is selected after reload
    await expect(MacromoleculesTopToolbar(page).peptidesButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('Case 7 - Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select DNA first
     * 3. Use Ctrl+Alt+R hotkey to switch to RNA
     * 4. Reload the page
     * 5. Verify RNA is restored from cache
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).dna();
    await page.keyboard.press('Control+Alt+KeyR');
    
    await pageReload(page);
    
    // Verify RNA is selected after reload
    await expect(MacromoleculesTopToolbar(page).rnaButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('Case 8 - Change polymer type by switching library tab to peptides, reload page, and verify cached type matches', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Change the polymer type by switching the library tab (e.g., to peptides tab), reload the page, and verify the cached type matches the last library tab used
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Switch to peptides library tab
     * 3. Reload the page
     * 4. Verify the cached type matches peptides
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Click on the peptides library tab
    await page.getByText('Peptides').click();
    
    await pageReload(page);
    
    // Verify peptides is selected after reload
    await expect(MacromoleculesTopToolbar(page).peptidesButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('Case 9 - Switch to PEP, reload page, enter flex mode, and verify peptide library tab opened by default despite switcher not being visible', async ({ FlexCanvas: _ }) => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Switch to PEP, reload the page, enter flex mode, and verify the peptide library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select PEP via polymer type switcher
     * 3. Reload the page
     * 4. Enter flex mode
     * 5. Verify peptide library tab is opened by default
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).peptides();
    
    await pageReload(page);
    
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Flex);
    
    // Verify peptides library tab is active
    await expect(page.getByText('Peptides')).toHaveClass(/selected|active/);
  });

  test('Case 10 - Switch to DNA, reload page, enter snake mode, and verify DNA library tab opened by default despite switcher not being visible', async ({ SnakeCanvas: _ }) => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Switch to DNA, reload the page, enter snake mode, and verify the DNA library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select DNA via polymer type switcher
     * 3. Reload the page
     * 4. Enter snake mode
     * 5. Verify DNA library tab is opened by default
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).dna();
    
    await pageReload(page);
    
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Snake);
    
    // Verify DNA library tab is active (it might be called Nucleotides)
    await expect(page.getByText('Nucleotides').or(page.getByText('DNA'))).toHaveClass(/selected|active/);
  });

  test('Case 11 - Clear browser cache, open macromolecule mode, and verify RNA is selected as fallback default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Clear browser cache/localStorage, open macromolecule mode, and verify RNA is selected as the fallback default
     * Scenario:
     * 1. Clear browser cache/localStorage
     * 2. Open macromolecule mode
     * 3. Verify RNA is selected as the fallback default
     *
     * Version 3.15.0
     */
    await clearLocalStorage(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify RNA is selected as fallback default
    await expect(MacromoleculesTopToolbar(page).rnaButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('Case 12 - Verify polymer type persists across browser tabs', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Verify that switching polymer type in one browser tab and opening a new tab reflects the cached value in the new tab
     * Scenario:
     * 1. Switch to macromolecule mode and select DNA
     * 2. Open a new tab/page
     * 3. Switch to macromolecule mode in new tab
     * 4. Verify DNA is selected in the new tab
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).dna();
    
    // Open a new page instance (simulating a new tab)
    const newPage = await page.context().newPage();
    await newPage.goto(page.url());
    
    // Wait for the page to load and switch to macromolecule mode
    await newPage.waitForLoadState('networkidle');
    await CommonTopRightToolbar(newPage).turnOnMacromoleculesEditor();
    
    // Verify DNA is selected in the new tab
    await expect(MacromoleculesTopToolbar(newPage).dnaButton).toHaveAttribute('aria-pressed', 'true');
    
    await newPage.close();
  });

  test('Case 13 - Switch polymer type multiple times in sequence, reload, and verify only the last selected type is restored', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Switch polymer type multiple times in sequence (RNA → DNA → PEP → DNA), reload, and verify only the last selected type (DNA) is restored
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select RNA → DNA → PEP → DNA in sequence
     * 3. Reload the page
     * 4. Verify only the last selected type (DNA) is restored
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Switch polymer types in sequence: RNA → DNA → PEP → DNA
    await MacromoleculesTopToolbar(page).rna();
    await MacromoleculesTopToolbar(page).dna();
    await MacromoleculesTopToolbar(page).peptides();
    await MacromoleculesTopToolbar(page).dna();
    
    await pageReload(page);
    
    // Verify only the last selected type (DNA) is restored
    await expect(MacromoleculesTopToolbar(page).dnaButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('Case 14 - Verify cached polymer type persists after switching to micro mode and back to macro', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Verify that the cached polymer type persists after navigating away from macromolecule mode to small molecule mode and back
     * Scenario:
     * 1. Switch to macromolecule mode and select PEP
     * 2. Switch to small molecule mode
     * 3. Switch back to macromolecule mode
     * 4. Verify PEP is still selected
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).peptides();
    
    // Switch to small molecule mode
    await CommonTopRightToolbar(page).turnOnMicromoleculesEditor();
    
    // Switch back to macromolecule mode
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify PEP is still selected
    await expect(MacromoleculesTopToolbar(page).peptidesButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('Case 15 - Verify graceful fallback for invalid cached polymer type value', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Verify that an invalid or corrupted cache value for polymer type falls back gracefully to the RNA default
     * Scenario:
     * 1. Manually set an invalid polymer type value in localStorage
     * 2. Switch to macromolecule mode
     * 3. Verify it falls back gracefully to RNA default
     *
     * Version 3.15.0
     */
    // Set an invalid polymer type value in localStorage
    await page.evaluate(() => {
      localStorage.setItem('polymer-type', 'INVALID_TYPE');
    });
    
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify it falls back gracefully to RNA default
    await expect(MacromoleculesTopToolbar(page).rnaButton).toHaveAttribute('aria-pressed', 'true');
  });
});