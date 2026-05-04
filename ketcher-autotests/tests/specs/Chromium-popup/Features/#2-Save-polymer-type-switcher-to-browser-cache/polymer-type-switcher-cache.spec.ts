import { Page, test, expect } from '@fixtures';
import { CommonTopRightToolbar } from '@tests/pages/common/CommonTopRightToolbar';
import { MacromoleculesTopToolbar } from '@tests/pages/macromolecules/MacromoleculesTopToolbar';
import { clearLocalStorage, pageReload } from '@utils/common/helpers';
import { LayoutMode } from '@tests/pages/constants';

let page: Page;

test.describe('Autotests: Save polymer type switcher to browser cache', () => {
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
     * 2. Open macromolecule mode
     * 3. Verify RNA is selected as the default polymer type
     *
     * Version 3.14.0
     */
    await clearLocalStorage(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify RNA is the default polymer type
    const macroToolbar = MacromoleculesTopToolbar(page);
    await expect(page.locator('[data-testid="RNA"]')).toHaveClass(/active/);
  });

  test('Case 2 - Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select DNA polymer type via switcher
     * 3. Reload the page
     * 4. Switch back to macromolecule mode
     * 5. Verify DNA is selected as the polymer type
     *
     * Version 3.14.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    const macroToolbar = MacromoleculesTopToolbar(page);
    await macroToolbar.dna();
    
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify DNA is still selected after reload
    await expect(page.locator('[data-testid="DNA"]')).toHaveClass(/active/);
  });

  test('Case 3 - Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select PEP polymer type via switcher
     * 3. Reload the page
     * 4. Switch back to macromolecule mode
     * 5. Verify PEP is selected as the polymer type
     *
     * Version 3.14.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    const macroToolbar = MacromoleculesTopToolbar(page);
    await macroToolbar.peptides();
    
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify PEP is still selected after reload
    await expect(page.locator('[data-testid="PEPTIDE"]')).toHaveClass(/active/);
  });

  test('Case 4 - Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select RNA polymer type via switcher (explicitly)
     * 3. Reload the page
     * 4. Switch back to macromolecule mode
     * 5. Verify RNA is selected as the polymer type
     *
     * Version 3.14.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    const macroToolbar = MacromoleculesTopToolbar(page);
    await macroToolbar.rna();
    
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify RNA is still selected after reload
    await expect(page.locator('[data-testid="RNA"]')).toHaveClass(/active/);
  });

  test('Case 5 - Use Ctrl+Alt+D hotkey to switch to DNA, reload the page, and verify DNA is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Use Ctrl+Alt+D hotkey to switch to DNA, reload the page, and verify DNA is restored from cache
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Use Ctrl+Alt+D hotkey to switch to DNA
     * 3. Reload the page
     * 4. Switch back to macromolecule mode
     * 5. Verify DNA is selected as the polymer type
     *
     * Version 3.14.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await page.keyboard.press('Control+Alt+d');
    
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify DNA is still selected after reload
    await expect(page.locator('[data-testid="DNA"]')).toHaveClass(/active/);
  });

  test('Case 6 - Use Ctrl+Alt+P hotkey to switch to PEP, reload the page, and verify PEP is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Use Ctrl+Alt+P hotkey to switch to PEP, reload the page, and verify PEP is restored from cache
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Use Ctrl+Alt+P hotkey to switch to PEP
     * 3. Reload the page
     * 4. Switch back to macromolecule mode
     * 5. Verify PEP is selected as the polymer type
     *
     * Version 3.14.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await page.keyboard.press('Control+Alt+p');
    
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify PEP is still selected after reload
    await expect(page.locator('[data-testid="PEPTIDE"]')).toHaveClass(/active/);
  });

  test('Case 7 - Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Use Ctrl+Alt+R hotkey to switch to RNA
     * 3. Reload the page
     * 4. Switch back to macromolecule mode
     * 5. Verify RNA is selected as the polymer type
     *
     * Version 3.14.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await page.keyboard.press('Control+Alt+r');
    
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify RNA is still selected after reload
    await expect(page.locator('[data-testid="RNA"]')).toHaveClass(/active/);
  });

  test('Case 8 - Change the polymer type by switching the library tab, reload the page, and verify the cached type matches the last library tab used', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Change the polymer type by switching the library tab, reload the page, and verify the cached type matches the last library tab used
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Switch to peptides library tab
     * 3. Reload the page
     * 4. Switch back to macromolecule mode
     * 5. Verify the polymer type matches the last library tab used (PEP)
     *
     * Version 3.14.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Click on Peptides library tab to change polymer type
    await page.locator('[data-testid="PEPTIDE-TAB"]').click();
    
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify PEP is selected after reload (matching the library tab)
    await expect(page.locator('[data-testid="PEPTIDE"]')).toHaveClass(/active/);
  });

  test('Case 9 - Switch to PEP, reload, enter flex mode, and verify peptide library tab is opened by default despite switcher not being visible', async ({
    FlexCanvas: _,
  }) => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Switch to PEP, reload, enter flex mode, and verify peptide library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select PEP polymer type
     * 3. Reload the page
     * 4. Switch to macromolecule mode and enter flex mode
     * 5. Verify peptide library tab is opened by default even though polymer switcher is not visible
     *
     * Version 3.14.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    const macroToolbar = MacromoleculesTopToolbar(page);
    await macroToolbar.peptides();
    
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Switch to Flex mode
    await macroToolbar.selectLayoutModeTool(LayoutMode.Flex);
    
    // Verify peptide library tab is active despite switcher not being visible in flex mode
    await expect(page.locator('[data-testid="PEPTIDE-TAB"]')).toHaveClass(/active/);
  });

  test('Case 10 - Switch to DNA, reload, enter snake mode, and verify DNA library tab is opened by default despite switcher not being visible', async ({
    SnakeCanvas: _,
  }) => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Switch to DNA, reload, enter snake mode, and verify DNA library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select DNA polymer type
     * 3. Reload the page
     * 4. Switch to macromolecule mode and enter snake mode
     * 5. Verify DNA library tab is opened by default even though polymer switcher is not visible
     *
     * Version 3.14.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    const macroToolbar = MacromoleculesTopToolbar(page);
    await macroToolbar.dna();
    
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Switch to Snake mode
    await macroToolbar.selectLayoutModeTool(LayoutMode.Snake);
    
    // Verify DNA library tab is active despite switcher not being visible in snake mode
    await expect(page.locator('[data-testid="DNA-TAB"]')).toHaveClass(/active/);
  });

  test('Case 11 - Clear browser cache/localStorage, open macromolecule mode, and verify RNA is selected as the fallback default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Clear browser cache/localStorage, open macromolecule mode, and verify RNA is selected as the fallback default
     * Scenario:
     * 1. Clear browser cache/localStorage completely
     * 2. Switch to macromolecule mode
     * 3. Verify RNA is selected as the fallback default
     *
     * Version 3.14.0
     */
    await clearLocalStorage(page);
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify RNA is the fallback default after clearing cache
    await expect(page.locator('[data-testid="RNA"]')).toHaveClass(/active/);
  });

  test('Case 12 - Switch polymer type multiple times, reload, and verify only the last selected type is restored', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Switch polymer type multiple times in sequence (RNA → DNA → PEP → DNA), reload, and verify only the last selected type (DNA) is restored
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Switch polymer type: RNA → DNA → PEP → DNA
     * 3. Reload the page
     * 4. Switch back to macromolecule mode
     * 5. Verify only the last selected type (DNA) is restored
     *
     * Version 3.14.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    const macroToolbar = MacromoleculesTopToolbar(page);
    
    // Sequence: RNA → DNA → PEP → DNA
    await macroToolbar.rna();
    await macroToolbar.dna();
    await macroToolbar.peptides();
    await macroToolbar.dna(); // Last selection
    
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify only the last selected type (DNA) is restored
    await expect(page.locator('[data-testid="DNA"]')).toHaveClass(/active/);
  });

  test('Case 13 - Verify cached polymer type persists after switching between micro and macro modes', async () => {
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
     * Version 3.14.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    const macroToolbar = MacromoleculesTopToolbar(page);
    await macroToolbar.peptides();
    
    // Switch to small molecule mode
    await CommonTopRightToolbar(page).turnOnMicromoleculesEditor();
    
    // Switch back to macromolecule mode
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify PEP is still selected after mode switching
    await expect(page.locator('[data-testid="PEPTIDE"]')).toHaveClass(/active/);
  });

  test('Case 14 - Verify graceful fallback to RNA default for invalid cache values', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Verify that an invalid or corrupted cache value for polymer type falls back gracefully to the RNA default
     * Scenario:
     * 1. Set invalid polymer type value in localStorage
     * 2. Reload the page
     * 3. Switch to macromolecule mode
     * 4. Verify RNA is selected as fallback default
     *
     * Version 3.14.0
     */
    // Set invalid polymer type value in localStorage
    await page.evaluate(() => {
      localStorage.setItem('ketcher-polymer-type', 'INVALID_TYPE');
    });
    
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify RNA is selected as fallback default for invalid cache value
    await expect(page.locator('[data-testid="RNA"]')).toHaveClass(/active/);
  });

  test('Case 15 - Verify cached polymer type is shared between browser tabs', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Verify that switching polymer type in one browser tab and opening a new tab reflects the cached value in the new tab
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select DNA polymer type
     * 3. Open new browser tab with the same application
     * 4. Switch to macromolecule mode in new tab
     * 5. Verify DNA is selected in the new tab
     *
     * Version 3.14.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    const macroToolbar = MacromoleculesTopToolbar(page);
    await macroToolbar.dna();
    
    // Open new tab (context)
    const newPage = await page.context().newPage();
    await newPage.goto(page.url());
    await CommonTopRightToolbar(newPage).turnOnMacromoleculesEditor();
    
    // Verify DNA is selected in the new tab
    await expect(newPage.locator('[data-testid="DNA"]')).toHaveClass(/active/);
    
    // Clean up new page
    await newPage.close();
  });
});