import { Page, test, expect } from '@fixtures';
import { CommonTopRightToolbar } from '@tests/pages/common/CommonTopRightToolbar';
import { Library } from '@tests/pages/macromolecules/Library';
import { MacromoleculesTopToolbar } from '@tests/pages/macromolecules/MacromoleculesTopToolbar';
import { LayoutMode } from '@tests/pages/constants/macromoleculesTopToolbar/Constants';
import { LibraryTab } from '@tests/pages/constants/library/Constants';
import { pageReload, clearLocalStorage } from '@utils/common/helpers';
import { keyboardPressOnCanvas, getAltModifier } from '@utils/keyboard/index';
import { takeEditorScreenshot } from '@utils';

let page: Page;

test.describe('Autotests: Polymer Type Switcher Cache', () => {
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
     * 3. Verify RNA is selected as the default
     *
     * Version 3.15.0
     */
    await clearLocalStorage(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify RNA button is active and RNA tab is selected in library
    await expect(MacromoleculesTopToolbar(page).rnaButton).toHaveAttribute('data-selected', 'true');
    await expect(Library(page).rnaTab).toHaveAttribute('aria-selected', 'true');
  });

  test('Case 2 - Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select DNA via polymer switcher
     * 3. Reload the page
     * 4. Verify DNA is restored from cache
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).dna();
    await page.waitForTimeout(500); // Wait for cache to be saved
    
    await pageReload(page);
    
    // Verify DNA button is active and appropriate library tab is selected
    await expect(MacromoleculesTopToolbar(page).dnaButton).toHaveAttribute('data-selected', 'true');
  });

  test('Case 3 - Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select PEP via polymer switcher
     * 3. Reload the page
     * 4. Verify PEP is restored from cache
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).peptides();
    await page.waitForTimeout(500); // Wait for cache to be saved
    
    await pageReload(page);
    
    // Verify PEP button is active and peptides tab is selected in library
    await expect(MacromoleculesTopToolbar(page).peptidesButton).toHaveAttribute('data-selected', 'true');
    await expect(Library(page).peptidesTab).toHaveAttribute('aria-selected', 'true');
  });

  test('Case 4 - Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected
     * Scenario:
     * 1. Switch to macromolecule mode with DNA selected
     * 2. Select RNA explicitly via polymer switcher
     * 3. Reload the page
     * 4. Verify RNA is restored from cache
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).dna(); // Start with DNA
    await MacromoleculesTopToolbar(page).rna(); // Switch to RNA
    await page.waitForTimeout(500); // Wait for cache to be saved
    
    await pageReload(page);
    
    // Verify RNA button is active and RNA tab is selected in library
    await expect(MacromoleculesTopToolbar(page).rnaButton).toHaveAttribute('data-selected', 'true');
    await expect(Library(page).rnaTab).toHaveAttribute('aria-selected', 'true');
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
    const altModifier = getAltModifier();
    await keyboardPressOnCanvas(page, `ControlOrMeta+${altModifier}+d`);
    await page.waitForTimeout(500); // Wait for cache to be saved
    
    await pageReload(page);
    
    // Verify DNA button is active
    await expect(MacromoleculesTopToolbar(page).dnaButton).toHaveAttribute('data-selected', 'true');
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
    const altModifier = getAltModifier();
    await keyboardPressOnCanvas(page, `ControlOrMeta+${altModifier}+p`);
    await page.waitForTimeout(500); // Wait for cache to be saved
    
    await pageReload(page);
    
    // Verify PEP button is active and peptides tab is selected
    await expect(MacromoleculesTopToolbar(page).peptidesButton).toHaveAttribute('data-selected', 'true');
    await expect(Library(page).peptidesTab).toHaveAttribute('aria-selected', 'true');
  });

  test('Case 7 - Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache
     * Scenario:
     * 1. Switch to macromolecule mode with PEP selected
     * 2. Use Ctrl+Alt+R hotkey to switch to RNA
     * 3. Reload the page
     * 4. Verify RNA is restored from cache
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).peptides(); // Start with PEP
    const altModifier = getAltModifier();
    await keyboardPressOnCanvas(page, `ControlOrMeta+${altModifier}+r`);
    await page.waitForTimeout(500); // Wait for cache to be saved
    
    await pageReload(page);
    
    // Verify RNA button is active and RNA tab is selected
    await expect(MacromoleculesTopToolbar(page).rnaButton).toHaveAttribute('data-selected', 'true');
    await expect(Library(page).rnaTab).toHaveAttribute('aria-selected', 'true');
  });

  test('Case 8 - Change the polymer type by switching the library tab, reload the page, and verify the cached type matches the last library tab used', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Change the polymer type by switching the library tab, reload the page, and verify the cached type matches the last library tab used
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Switch to peptides library tab
     * 3. Reload the page
     * 4. Verify polymer type matches library tab selection
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await Library(page).openTab(LibraryTab.Peptides);
    await page.waitForTimeout(500); // Wait for cache to be saved
    
    await pageReload(page);
    
    // Verify both polymer switcher and library tab are synchronized
    await expect(MacromoleculesTopToolbar(page).peptidesButton).toHaveAttribute('data-selected', 'true');
    await expect(Library(page).peptidesTab).toHaveAttribute('aria-selected', 'true');
  });

  test('Case 9 - Switch to PEP, reload the page, enter flex mode, and verify the peptide library tab is opened by default despite switcher not being visible', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Switch to PEP, reload the page, enter flex mode, and verify the peptide library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Switch to macromolecule mode and select PEP
     * 2. Reload the page
     * 3. Switch to flex layout mode
     * 4. Verify peptide library tab is selected
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).peptides();
    await page.waitForTimeout(500); // Wait for cache to be saved
    
    await pageReload(page);
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Flex);
    
    // Verify peptides tab is selected even in flex mode
    await expect(Library(page).peptidesTab).toHaveAttribute('aria-selected', 'true');
  });

  test('Case 10 - Switch to DNA, reload the page, enter snake mode, and verify the DNA library tab is opened by default despite switcher not being visible', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Switch to DNA, reload the page, enter snake mode, and verify the DNA library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Switch to macromolecule mode and select DNA
     * 2. Reload the page
     * 3. Switch to snake layout mode
     * 4. Verify appropriate DNA library tab is selected
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).dna();
    await page.waitForTimeout(500); // Wait for cache to be saved
    
    await pageReload(page);
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Snake);
    
    // Verify RNA tab is selected (DNA uses RNA library components)
    await expect(Library(page).rnaTab).toHaveAttribute('aria-selected', 'true');
  });

  test('Case 11 - Clear browser cache/localStorage, open macromolecule mode, and verify RNA is selected as the fallback default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Clear browser cache/localStorage, open macromolecule mode, and verify RNA is selected as the fallback default
     * Scenario:
     * 1. Set a different polymer type (DNA)
     * 2. Clear localStorage
     * 3. Reload and open macromolecule mode
     * 4. Verify RNA fallback is used
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).dna(); // Set DNA first
    await clearLocalStorage(page);
    await pageReload(page);
    
    // Verify RNA is the fallback default
    await expect(MacromoleculesTopToolbar(page).rnaButton).toHaveAttribute('data-selected', 'true');
    await expect(Library(page).rnaTab).toHaveAttribute('aria-selected', 'true');
  });

  test('Case 12 - Verify that switching polymer type in one browser tab and opening a new tab reflects the cached value in the new tab', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Verify that switching polymer type in one browser tab and opening a new tab reflects the cached value in the new tab
     * Scenario:
     * 1. Switch to macromolecule mode and select DNA
     * 2. Open a new browser tab
     * 3. Navigate to the application
     * 4. Verify DNA is selected in the new tab
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).dna();
    await page.waitForTimeout(500); // Wait for cache to be saved
    
    // Open new tab and navigate to the same URL
    const newTab = await page.context().newPage();
    await newTab.goto(page.url());
    await newTab.waitForLoadState('networkidle');
    
    // Turn on macromolecules editor in new tab
    const newTabCommonTopRightToolbar = CommonTopRightToolbar(newTab);
    const newTabMacromoleculesTopToolbar = MacromoleculesTopToolbar(newTab);
    const newTabLibrary = Library(newTab);
    
    await newTabCommonTopRightToolbar.turnOnMacromoleculesEditor();
    
    // Verify DNA is selected in the new tab
    await expect(newTabMacromoleculesTopToolbar.dnaButton).toHaveAttribute('data-selected', 'true');
    
    await newTab.close();
  });

  test('Case 13 - Switch polymer type multiple times in sequence, reload, and verify only the last selected type is restored', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Switch polymer type multiple times in sequence (RNA → DNA → PEP → DNA), reload, and verify only the last selected type (DNA) is restored
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select RNA → DNA → PEP → DNA in sequence
     * 3. Reload the page
     * 4. Verify only the last selection (DNA) is restored
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Switch multiple times: RNA → DNA → PEP → DNA
    await MacromoleculesTopToolbar(page).rna();
    await page.waitForTimeout(100);
    await MacromoleculesTopToolbar(page).dna();
    await page.waitForTimeout(100);
    await MacromoleculesTopToolbar(page).peptides();
    await page.waitForTimeout(100);
    await MacromoleculesTopToolbar(page).dna(); // Final selection
    await page.waitForTimeout(500); // Wait for cache to be saved
    
    await pageReload(page);
    
    // Verify only the last selection (DNA) is restored
    await expect(MacromoleculesTopToolbar(page).dnaButton).toHaveAttribute('data-selected', 'true');
  });

  test('Case 14 - Verify that the cached polymer type persists after navigating away from macromolecule mode to small molecule mode and back', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Verify that the cached polymer type persists after navigating away from macromolecule mode to small molecule mode and back
     * Scenario:
     * 1. Switch to macromolecule mode and select PEP
     * 2. Switch to micromolecule mode
     * 3. Switch back to macromolecule mode
     * 4. Verify PEP is still selected
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).peptides();
    await page.waitForTimeout(500); // Wait for cache to be saved
    
    // Switch to micromolecule mode and back
    await CommonTopRightToolbar(page).turnOnMicromoleculesEditor();
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify PEP is still selected
    await expect(MacromoleculesTopToolbar(page).peptidesButton).toHaveAttribute('data-selected', 'true');
    await expect(Library(page).peptidesTab).toHaveAttribute('aria-selected', 'true');
  });

  test('Case 15 - Verify that an invalid or corrupted cache value for polymer type falls back gracefully to the RNA default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Verify that an invalid or corrupted cache value for polymer type falls back gracefully to the RNA default
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Manually corrupt the cache value
     * 3. Reload the page
     * 4. Verify graceful fallback to RNA default
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Corrupt the cache by setting an invalid polymer type value
    await page.evaluate(() => {
      localStorage.setItem('ketcher-macromolecule-type', 'INVALID_POLYMER_TYPE');
    });
    
    await pageReload(page);
    
    // Verify graceful fallback to RNA default
    await expect(MacromoleculesTopToolbar(page).rnaButton).toHaveAttribute('data-selected', 'true');
    await expect(Library(page).rnaTab).toHaveAttribute('aria-selected', 'true');
  });
});