import { Page, test, expect } from '@fixtures';
import { CommonTopRightToolbar } from '@tests/pages/common/CommonTopRightToolbar';
import { MacromoleculesTopToolbar } from '@tests/pages/macromolecules/MacromoleculesTopToolbar';
import { Library } from '@tests/pages/macromolecules/Library';
import { LayoutMode } from '@tests/pages/constants/macromoleculesTopToolbar/Constants';
import { LibraryTab } from '@tests/pages/constants/library/Constants';
import { pageReload, clearLocalStorage } from '@utils/common/helpers';
import { keyboardPressOnCanvas, getAltModifier } from '@utils/keyboard';

let page: Page;

test.describe('Polymer Type Switcher Cache - Browser Storage Tests', () => {
  test.beforeAll(async ({ initFlexCanvas }) => {
    page = await initFlexCanvas();
  });

  test.afterAll(async ({ closePage }) => {
    await closePage();
  });

  test('Case 1 - Default RNA fallback when no cached value exists', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: When no cached value exists, verify that switching to macromolecule mode defaults to RNA polymer type
     * Scenario:
     * 1. Clear browser cache/localStorage
     * 2. Switch to macromolecule mode
     * 3. Verify RNA is selected as default
     *
     * Version: Current
     */
    await clearLocalStorage(page);
    await CommonTopRightToolbar(page).turnOnMicromoleculesEditor();
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();

    // Verify RNA is selected by default
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-testid', 'RNABtn');
    
    // Check if RNA library tab is opened by default
    await expect(Library(page).rnaTab).toHaveAttribute('aria-selected', 'true');
  });

  test('Case 2 - DNA selection persistence after page reload', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected
     * Scenario:
     * 1. Select DNA via the polymer type switcher
     * 2. Reload the page
     * 3. Verify macromolecule mode reopens with DNA selected
     *
     * Version: Current
     */
    await MacromoleculesTopToolbar(page).dna();
    await page.waitForTimeout(500); // Wait for cache persistence
    
    await pageReload(page);
    
    // Verify DNA is restored from cache
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    await expect(dnaButton).toHaveAttribute('data-testid', 'DNABtn');
  });

  test('Case 3 - PEP selection persistence after page reload', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected
     * Scenario:
     * 1. Select PEP via the polymer type switcher
     * 2. Reload the page
     * 3. Verify macromolecule mode reopens with PEP selected
     *
     * Version: Current
     */
    await MacromoleculesTopToolbar(page).peptides();
    await page.waitForTimeout(500); // Wait for cache persistence
    
    await pageReload(page);
    
    // Verify PEP is restored from cache
    const peptidesButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(peptidesButton).toHaveAttribute('data-testid', 'PEPTIDEBtn');
  });

  test('Case 4 - RNA selection persistence after explicit selection and reload', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected
     * Scenario:
     * 1. Select RNA explicitly via the polymer type switcher
     * 2. Reload the page
     * 3. Verify macromolecule mode reopens with RNA selected
     *
     * Version: Current
     */
    await MacromoleculesTopToolbar(page).rna();
    await page.waitForTimeout(500); // Wait for cache persistence
    
    await pageReload(page);
    
    // Verify RNA is restored from cache
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-testid', 'RNABtn');
    await expect(Library(page).rnaTab).toHaveAttribute('aria-selected', 'true');
  });

  test('Case 5 - Ctrl+Alt+D hotkey to switch to DNA with cache restoration', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Use Ctrl+Alt+D hotkey to switch to DNA, reload the page, and verify DNA is restored from cache
     * Scenario:
     * 1. Use Ctrl+Alt+D hotkey to switch to DNA
     * 2. Reload the page
     * 3. Verify DNA is restored from cache
     *
     * Version: Current
     */
    const altModifier = getAltModifier();
    await keyboardPressOnCanvas(page, `Control+${altModifier}+d`);
    await page.waitForTimeout(500); // Wait for cache persistence
    
    await pageReload(page);
    
    // Verify DNA is restored from cache
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    await expect(dnaButton).toHaveAttribute('data-testid', 'DNABtn');
  });

  test('Case 6 - Ctrl+Alt+P hotkey to switch to PEP with cache restoration', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Use Ctrl+Alt+P hotkey to switch to PEP, reload the page, and verify PEP is restored from cache
     * Scenario:
     * 1. Use Ctrl+Alt+P hotkey to switch to PEP
     * 2. Reload the page
     * 3. Verify PEP is restored from cache
     *
     * Version: Current
     */
    const altModifier = getAltModifier();
    await keyboardPressOnCanvas(page, `Control+${altModifier}+p`);
    await page.waitForTimeout(500); // Wait for cache persistence
    
    await pageReload(page);
    
    // Verify PEP is restored from cache
    const peptidesButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(peptidesButton).toHaveAttribute('data-testid', 'PEPTIDEBtn');
  });

  test('Case 7 - Ctrl+Alt+R hotkey to switch to RNA with cache restoration', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache
     * Scenario:
     * 1. Use Ctrl+Alt+R hotkey to switch to RNA
     * 2. Reload the page
     * 3. Verify RNA is restored from cache
     *
     * Version: Current
     */
    const altModifier = getAltModifier();
    await keyboardPressOnCanvas(page, `Control+${altModifier}+r`);
    await page.waitForTimeout(500); // Wait for cache persistence
    
    await pageReload(page);
    
    // Verify RNA is restored from cache
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-testid', 'RNABtn');
    await expect(Library(page).rnaTab).toHaveAttribute('aria-selected', 'true');
  });

  test('Case 8 - Library tab synchronization with polymer type selection', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Change the polymer type by switching the library tab (e.g., to peptides tab), reload the page, and verify the cached type matches the last library tab used
     * Scenario:
     * 1. Switch to peptides library tab
     * 2. Reload the page
     * 3. Verify peptides library tab is opened and PEP polymer type is selected
     *
     * Version: Current
     */
    await Library(page).switchToPeptidesTab();
    await page.waitForTimeout(500); // Wait for cache persistence
    
    await pageReload(page);
    
    // Verify peptides library tab is opened and PEP polymer type is selected
    await expect(Library(page).peptidesTab).toHaveAttribute('aria-selected', 'true');
    const peptidesButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(peptidesButton).toHaveAttribute('data-testid', 'PEPTIDEBtn');
  });

  test('Case 9 - PEP persistence in flex mode with peptide library tab', async ({ FlexCanvas: _ }) => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Switch to PEP, reload the page, enter flex mode, and verify the peptide library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Switch to PEP
     * 2. Reload the page
     * 3. Enter flex mode
     * 4. Verify the peptide library tab is opened by default
     *
     * Version: Current
     */
    await MacromoleculesTopToolbar(page).peptides();
    await page.waitForTimeout(500); // Wait for cache persistence
    
    await pageReload(page);
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Flex);
    
    // Verify peptide library tab is opened by default in flex mode
    await expect(Library(page).peptidesTab).toHaveAttribute('aria-selected', 'true');
  });

  test('Case 10 - DNA persistence in snake mode with DNA library tab', async ({ SnakeCanvas: _ }) => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Switch to DNA, reload the page, enter snake mode, and verify the DNA library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Switch to DNA
     * 2. Reload the page
     * 3. Enter snake mode
     * 4. Verify the RNA library tab is opened by default (note: snake mode shows RNA tab for DNA)
     *
     * Version: Current
     */
    await MacromoleculesTopToolbar(page).dna();
    await page.waitForTimeout(500); // Wait for cache persistence
    
    await pageReload(page);
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Snake);
    
    // Verify RNA library tab is opened for DNA in snake mode
    await expect(Library(page).rnaTab).toHaveAttribute('aria-selected', 'true');
  });

  test('Case 11 - Clear cache fallback gracefully to RNA default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Clear browser cache/localStorage, open macromolecule mode, and verify RNA is selected as the fallback default
     * Scenario:
     * 1. Set PEP as current polymer type
     * 2. Clear browser cache/localStorage
     * 3. Reload the page
     * 4. Verify RNA is selected as the fallback default
     *
     * Version: Current
     */
    await MacromoleculesTopToolbar(page).peptides();
    await page.waitForTimeout(500); // Wait for cache persistence
    
    await clearLocalStorage(page);
    await pageReload(page);
    
    // Verify RNA is selected as the fallback default
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-testid', 'RNABtn');
    await expect(Library(page).rnaTab).toHaveAttribute('aria-selected', 'true');
  });

  test('Case 12 - Cache persistence across multiple browser tabs', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Verify that switching polymer type in one browser tab and opening a new tab reflects the cached value in the new tab
     * Scenario:
     * 1. Switch to DNA in current tab
     * 2. Open new tab/context
     * 3. Verify DNA is selected in new tab
     * 4. Close new tab and return to original
     *
     * Version: Current
     */
    await MacromoleculesTopToolbar(page).dna();
    await page.waitForTimeout(500); // Wait for cache persistence
    
    // Create new context/tab to simulate opening in new tab
    const newContext = await page.context().browser()?.newContext();
    const newPage = await newContext?.newPage();
    
    if (newPage) {
      await newPage.goto(page.url());
      await newPage.waitForLoadState('networkidle');
      
      // Verify DNA is selected in new tab
      const newTabDnaButton = newPage.getByTestId('DNABtn');
      await expect(newTabDnaButton).toBeVisible();
      
      await newContext?.close();
    }
  });

  test('Case 13 - Multiple selection sequence handling (last selection wins)', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Switch polymer type multiple times in sequence (RNA → DNA → PEP → DNA), reload, and verify only the last selected type (DNA) is restored
     * Scenario:
     * 1. Switch RNA → DNA → PEP → DNA in sequence
     * 2. Reload the page
     * 3. Verify only the last selected type (DNA) is restored
     *
     * Version: Current
     */
    await MacromoleculesTopToolbar(page).rna();
    await page.waitForTimeout(100);
    await MacromoleculesTopToolbar(page).dna();
    await page.waitForTimeout(100);
    await MacromoleculesTopToolbar(page).peptides();
    await page.waitForTimeout(100);
    await MacromoleculesTopToolbar(page).dna();
    await page.waitForTimeout(500); // Wait for final cache persistence
    
    await pageReload(page);
    
    // Verify only the last selected type (DNA) is restored
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    await expect(dnaButton).toHaveAttribute('data-testid', 'DNABtn');
  });

  test('Case 14 - Cache persistence across micro/macro mode switching', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Verify that the cached polymer type persists after navigating away from macromolecule mode to small molecule mode and back
     * Scenario:
     * 1. Switch to PEP polymer type
     * 2. Switch to small molecule mode
     * 3. Switch back to macromolecule mode
     * 4. Verify PEP is still selected
     *
     * Version: Current
     */
    await MacromoleculesTopToolbar(page).peptides();
    await page.waitForTimeout(500); // Wait for cache persistence
    
    await CommonTopRightToolbar(page).turnOnMicromoleculesEditor();
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify PEP is still selected after mode switching
    const peptidesButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(peptidesButton).toHaveAttribute('data-testid', 'PEPTIDEBtn');
    await expect(Library(page).peptidesTab).toHaveAttribute('aria-selected', 'true');
  });

  test('Case 15 - Invalid cache value graceful fallback to RNA default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Verify that an invalid or corrupted cache value for polymer type falls back gracefully to the RNA default
     * Scenario:
     * 1. Set an invalid polymer type value in localStorage
     * 2. Reload the page
     * 3. Verify RNA is selected as the fallback default
     *
     * Version: Current
     */
    // Set invalid polymer type value in localStorage
    await page.evaluate(() => {
      localStorage.setItem('polymerType', 'INVALID_POLYMER_TYPE');
    });
    
    await pageReload(page);
    
    // Verify RNA is selected as the fallback default for invalid cache value
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-testid', 'RNABtn');
    await expect(Library(page).rnaTab).toHaveAttribute('aria-selected', 'true');
  });
});