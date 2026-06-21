import { Page, test, expect } from '@fixtures';
import { CommonTopRightToolbar } from '@tests/pages/common/CommonTopRightToolbar';
import { MacromoleculesTopToolbar } from '@tests/pages/macromolecules/MacromoleculesTopToolbar';
import { Library } from '@tests/pages/macromolecules/Library';
import { pageReload, clearLocalStorage } from '@utils/common/helpers';
import { LayoutMode } from '@tests/pages/constants/macromoleculesTopToolbar/Constants';
import { LibraryTab } from '@tests/pages/constants/library/Constants';

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
     * 1. Clear local storage to ensure no cached value exists
     * 2. Switch to macromolecule mode
     * 3. Verify that RNA button is selected by default
     *
     * Version 3.15.0
     */
    await clearLocalStorage(page);
    await pageReload(page);
    
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    const peptidesButton = MacromoleculesTopToolbar(page).peptidesButton;
    
    // Verify RNA is selected by default
    await expect(rnaButton).toHaveAttribute('data-testid', 'RNABtn');
    const rnaSelected = await rnaButton.getAttribute('class');
    expect(rnaSelected).toContain('selected');
    
    // Verify DNA and PEP are not selected
    const dnaSelected = await dnaButton.getAttribute('class');
    const pepSelected = await peptidesButton.getAttribute('class');
    expect(dnaSelected).not.toContain('selected');
    expect(pepSelected).not.toContain('selected');
  });

  test('Case 2 - Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected
     * Scenario:
     * 1. Switch to DNA polymer type
     * 2. Reload the page
     * 3. Verify DNA is selected after reload
     *
     * Version 3.15.0
     */
    await MacromoleculesTopToolbar(page).dna();
    await page.waitForTimeout(100); // Allow state to be saved
    await pageReload(page);
    
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    const dnaSelected = await dnaButton.getAttribute('class');
    expect(dnaSelected).toContain('selected');
  });

  test('Case 3 - Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected
     * Scenario:
     * 1. Switch to PEP polymer type
     * 2. Reload the page
     * 3. Verify PEP is selected after reload
     *
     * Version 3.15.0
     */
    await MacromoleculesTopToolbar(page).peptides();
    await page.waitForTimeout(100); // Allow state to be saved
    await pageReload(page);
    
    const peptidesButton = MacromoleculesTopToolbar(page).peptidesButton;
    const pepSelected = await peptidesButton.getAttribute('class');
    expect(pepSelected).toContain('selected');
  });

  test('Case 4 - Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected
     * Scenario:
     * 1. Switch to RNA polymer type explicitly
     * 2. Reload the page
     * 3. Verify RNA is selected after reload
     *
     * Version 3.15.0
     */
    await MacromoleculesTopToolbar(page).rna();
    await page.waitForTimeout(100); // Allow state to be saved
    await pageReload(page);
    
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    const rnaSelected = await rnaButton.getAttribute('class');
    expect(rnaSelected).toContain('selected');
  });

  test('Case 5 - Use Ctrl+Alt+D hotkey to switch to DNA, reload the page, and verify DNA is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Use Ctrl+Alt+D hotkey to switch to DNA, reload the page, and verify DNA is restored from cache
     * Scenario:
     * 1. Use Ctrl+Alt+D hotkey to switch to DNA
     * 2. Reload the page
     * 3. Verify DNA is selected after reload
     *
     * Version 3.15.0
     */
    await page.keyboard.press('Control+Alt+KeyD');
    await page.waitForTimeout(100); // Allow state to be saved
    await pageReload(page);
    
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    const dnaSelected = await dnaButton.getAttribute('class');
    expect(dnaSelected).toContain('selected');
  });

  test('Case 6 - Use Ctrl+Alt+P hotkey to switch to PEP, reload the page, and verify PEP is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Use Ctrl+Alt+P hotkey to switch to PEP, reload the page, and verify PEP is restored from cache
     * Scenario:
     * 1. Use Ctrl+Alt+P hotkey to switch to PEP
     * 2. Reload the page
     * 3. Verify PEP is selected after reload
     *
     * Version 3.15.0
     */
    await page.keyboard.press('Control+Alt+KeyP');
    await page.waitForTimeout(100); // Allow state to be saved
    await pageReload(page);
    
    const peptidesButton = MacromoleculesTopToolbar(page).peptidesButton;
    const pepSelected = await peptidesButton.getAttribute('class');
    expect(pepSelected).toContain('selected');
  });

  test('Case 7 - Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache
     * Scenario:
     * 1. Use Ctrl+Alt+R hotkey to switch to RNA
     * 2. Reload the page
     * 3. Verify RNA is selected after reload
     *
     * Version 3.15.0
     */
    await page.keyboard.press('Control+Alt+KeyR');
    await page.waitForTimeout(100); // Allow state to be saved
    await pageReload(page);
    
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    const rnaSelected = await rnaButton.getAttribute('class');
    expect(rnaSelected).toContain('selected');
  });

  test('Case 8 - Change the polymer type by switching the library tab to peptides tab, reload the page, and verify the cached type matches the last library tab used', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Change the polymer type by switching the library tab (e.g., to peptides tab), reload the page, and verify the cached type matches the last library tab used
     * Scenario:
     * 1. Switch to peptides library tab
     * 2. Reload the page
     * 3. Verify PEP polymer type is selected and peptides library tab is opened
     *
     * Version 3.15.0
     */
    const library = Library(page);
    await library.switchToPeptidesTab();
    await page.waitForTimeout(100); // Allow state to be saved
    await pageReload(page);
    
    const peptidesButton = MacromoleculesTopToolbar(page).peptidesButton;
    const pepSelected = await peptidesButton.getAttribute('class');
    expect(pepSelected).toContain('selected');
    
    // Verify peptides tab is selected in library
    const isPeptidesTabOpen = await library.isTabOpened(LibraryTab.Peptides);
    expect(isPeptidesTabOpen).toBeTruthy();
  });

  test('Case 9 - Switch to PEP, reload the page, enter flex mode, and verify the peptide library tab is opened by default despite switcher not being visible', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Switch to PEP, reload the page, enter flex mode, and verify the peptide library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Switch to PEP polymer type
     * 2. Reload the page
     * 3. Switch to flex mode
     * 4. Verify peptides library tab is opened
     *
     * Version 3.15.0
     */
    await MacromoleculesTopToolbar(page).peptides();
    await page.waitForTimeout(100); // Allow state to be saved
    await pageReload(page);
    
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Flex);
    
    const library = Library(page);
    const isPeptidesTabOpen = await library.isTabOpened(LibraryTab.Peptides);
    expect(isPeptidesTabOpen).toBeTruthy();
  });

  test('Case 10 - Switch to DNA, reload the page, enter snake mode, and verify the RNA library tab is opened by default despite switcher not being visible', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Switch to DNA, reload the page, enter snake mode, and verify the DNA library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Switch to DNA polymer type
     * 2. Reload the page
     * 3. Switch to snake mode
     * 4. Verify RNA library tab is opened (as DNA uses RNA library)
     *
     * Version 3.15.0
     */
    await MacromoleculesTopToolbar(page).dna();
    await page.waitForTimeout(100); // Allow state to be saved
    await pageReload(page);
    
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Snake);
    
    const library = Library(page);
    const isRNATabOpen = await library.isTabOpened(LibraryTab.RNA);
    expect(isRNATabOpen).toBeTruthy();
  });

  test('Case 11 - Clear browser cache/localStorage, open macromolecule mode, and verify RNA is selected as the fallback default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Clear browser cache/localStorage, open macromolecule mode, and verify RNA is selected as the fallback default
     * Scenario:
     * 1. Clear localStorage to remove any cached polymer type
     * 2. Reload the page
     * 3. Verify RNA is selected as default
     *
     * Version 3.15.0
     */
    await clearLocalStorage(page);
    await pageReload(page);
    
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    const rnaSelected = await rnaButton.getAttribute('class');
    expect(rnaSelected).toContain('selected');
  });

  test('Case 12 - Verify that switching polymer type in one browser tab and opening a new tab reflects the cached value in the new tab', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Verify that switching polymer type in one browser tab and opening a new tab reflects the cached value in the new tab
     * Scenario:
     * 1. Switch to DNA in current tab
     * 2. Open a new browser tab/page
     * 3. Verify DNA is selected in the new tab
     *
     * Version 3.15.0
     */
    await MacromoleculesTopToolbar(page).dna();
    await page.waitForTimeout(100); // Allow state to be saved
    
    // Open new tab and navigate to the same URL
    const newPage = await page.context().newPage();
    await newPage.goto(page.url());
    await newPage.waitForLoadState('networkidle');
    
    // Initialize the new page similar to current setup
    const { CommonTopRightToolbar: NewCommonTopRightToolbar } = await import('@tests/pages/common/CommonTopRightToolbar');
    const { MacromoleculesTopToolbar: NewMacromoleculesTopToolbar } = await import('@tests/pages/macromolecules/MacromoleculesTopToolbar');
    
    await NewCommonTopRightToolbar(newPage).turnOnMacromoleculesEditor();
    
    const newDnaButton = NewMacromoleculesTopToolbar(newPage).dnaButton;
    const newDnaSelected = await newDnaButton.getAttribute('class');
    expect(newDnaSelected).toContain('selected');
    
    await newPage.close();
  });

  test('Case 13 - Switch polymer type multiple times in sequence (RNA → DNA → PEP → DNA), reload, and verify only the last selected type (DNA) is restored', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Switch polymer type multiple times in sequence (RNA → DNA → PEP → DNA), reload, and verify only the last selected type (DNA) is restored
     * Scenario:
     * 1. Switch through polymer types in sequence: RNA → DNA → PEP → DNA
     * 2. Reload the page
     * 3. Verify only the last selected type (DNA) is restored
     *
     * Version 3.15.0
     */
    await MacromoleculesTopToolbar(page).rna();
    await page.waitForTimeout(50);
    await MacromoleculesTopToolbar(page).dna();
    await page.waitForTimeout(50);
    await MacromoleculesTopToolbar(page).peptides();
    await page.waitForTimeout(50);
    await MacromoleculesTopToolbar(page).dna();
    await page.waitForTimeout(100); // Allow final state to be saved
    
    await pageReload(page);
    
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    const peptidesButton = MacromoleculesTopToolbar(page).peptidesButton;
    
    const dnaSelected = await dnaButton.getAttribute('class');
    const rnaSelected = await rnaButton.getAttribute('class');
    const pepSelected = await peptidesButton.getAttribute('class');
    
    expect(dnaSelected).toContain('selected');
    expect(rnaSelected).not.toContain('selected');
    expect(pepSelected).not.toContain('selected');
  });

  test('Case 14 - Verify that the cached polymer type persists after navigating away from macromolecule mode to small molecule mode and back', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Verify that the cached polymer type persists after navigating away from macromolecule mode to small molecule mode and back
     * Scenario:
     * 1. Switch to PEP polymer type in macro mode
     * 2. Switch to micro mode
     * 3. Switch back to macro mode
     * 4. Verify PEP is still selected
     *
     * Version 3.15.0
     */
    await MacromoleculesTopToolbar(page).peptides();
    await page.waitForTimeout(100); // Allow state to be saved
    
    // Switch to micro mode
    await CommonTopRightToolbar(page).turnOnMicromoleculesEditor();
    await page.waitForTimeout(100);
    
    // Switch back to macro mode
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await page.waitForTimeout(100);
    
    const peptidesButton = MacromoleculesTopToolbar(page).peptidesButton;
    const pepSelected = await peptidesButton.getAttribute('class');
    expect(pepSelected).toContain('selected');
  });

  test('Case 15 - Verify that an invalid or corrupted cache value for polymer type falls back gracefully to the RNA default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Verify that an invalid or corrupted cache value for polymer type falls back gracefully to the RNA default
     * Scenario:
     * 1. Set an invalid polymer type value in localStorage
     * 2. Reload the page
     * 3. Verify RNA is selected as fallback default
     *
     * Version 3.15.0
     */
    // Set an invalid polymer type in localStorage
    await page.evaluate(() => {
      localStorage.setItem('ketcher-polymer-type', 'INVALID_POLYMER_TYPE');
    });
    
    await pageReload(page);
    
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    const peptidesButton = MacromoleculesTopToolbar(page).peptidesButton;
    
    const rnaSelected = await rnaButton.getAttribute('class');
    const dnaSelected = await dnaButton.getAttribute('class');
    const pepSelected = await peptidesButton.getAttribute('class');
    
    // Verify RNA is selected as fallback
    expect(rnaSelected).toContain('selected');
    expect(dnaSelected).not.toContain('selected');
    expect(pepSelected).not.toContain('selected');
  });
});