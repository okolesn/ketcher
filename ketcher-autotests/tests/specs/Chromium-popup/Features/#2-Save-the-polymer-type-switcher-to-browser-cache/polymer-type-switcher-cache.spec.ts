import { Page, test, expect } from '@fixtures';
import { CommonTopRightToolbar } from '@tests/pages/common/CommonTopRightToolbar';
import { MacromoleculesTopToolbar } from '@tests/pages/macromolecules/MacromoleculesTopToolbar';
import { Library } from '@tests/pages/macromolecules/Library';
import { LibraryTab } from '@tests/pages/constants/library/Constants';
import { LayoutMode } from '@tests/pages/constants/macromoleculesTopToolbar/Constants';
import { clearLocalStorage, pageReload } from '@utils/common/helpers';
import { takeEditorScreenshot } from '@utils';

let page: Page;

test.describe('Autotests: Save the polymer type switcher (RNA/DNA/PEP) to browser cache', () => {
  test.beforeAll(async ({ initMoleculesCanvas }) => {
    page = await initMoleculesCanvas();
  });

  test.beforeEach(async () => {
    // Clear localStorage before each test to ensure clean state
    await clearLocalStorage(page);
    await pageReload(page);
  });

  test.afterAll(async ({ closePage }) => {
    await closePage();
  });

  test('Case 1 - When no cached value exists, verify that switching to macromolecule mode defaults to RNA polymer type', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: When no cached value exists, verify that switching to macromolecule mode defaults to RNA polymer type
     * Scenario:
     * 1. Clear localStorage to simulate fresh browser state
     * 2. Switch to macromolecules mode
     * 3. Verify RNA is selected as default polymer type
     * 4. Verify RNA library tab is opened by default
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify RNA button is active by default
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-teststate', 'active');
    
    // Verify RNA library tab is opened by default
    const rnaTab = Library(page).rnaTab;
    await expect(rnaTab).toHaveAttribute('aria-selected', 'true');
    
    await takeEditorScreenshot(page);
  });

  test('Case 2 - Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected
     * Scenario:
     * 1. Switch to macromolecules mode
     * 2. Select DNA via the polymer type switcher
     * 3. Reload the page
     * 4. Switch back to macromolecules mode
     * 5. Verify DNA is selected from cache
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).dna();
    
    // Verify DNA button is active
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    await expect(dnaButton).toHaveAttribute('data-teststate', 'active');
    
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify DNA is restored from cache
    await expect(dnaButton).toHaveAttribute('data-teststate', 'active');
    
    // Verify DNA library tab is opened
    const dnaTab = page.getByTestId(LibraryTab.DNA);
    await expect(dnaTab).toHaveAttribute('aria-selected', 'true');
    
    await takeEditorScreenshot(page);
  });

  test('Case 3 - Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected
     * Scenario:
     * 1. Switch to macromolecules mode
     * 2. Select PEP via the polymer type switcher
     * 3. Reload the page
     * 4. Switch back to macromolecules mode
     * 5. Verify PEP is selected from cache
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).peptides();
    
    // Verify PEP button is active
    const pepButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(pepButton).toHaveAttribute('data-teststate', 'active');
    
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify PEP is restored from cache
    await expect(pepButton).toHaveAttribute('data-teststate', 'active');
    
    // Verify Peptides library tab is opened
    const peptidesTab = page.getByTestId(LibraryTab.Peptides);
    await expect(peptidesTab).toHaveAttribute('aria-selected', 'true');
    
    await takeEditorScreenshot(page);
  });

  test('Case 4 - Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected
     * Scenario:
     * 1. Switch to macromolecules mode
     * 2. Select DNA first to change from default
     * 3. Select RNA explicitly via the polymer type switcher
     * 4. Reload the page
     * 5. Switch back to macromolecules mode
     * 6. Verify RNA is selected from cache
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).dna(); // Change from default
    await MacromoleculesTopToolbar(page).rna(); // Explicitly select RNA
    
    // Verify RNA button is active
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-teststate', 'active');
    
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify RNA is restored from cache
    await expect(rnaButton).toHaveAttribute('data-teststate', 'active');
    
    // Verify RNA library tab is opened
    const rnaTab = Library(page).rnaTab;
    await expect(rnaTab).toHaveAttribute('aria-selected', 'true');
    
    await takeEditorScreenshot(page);
  });

  test('Case 5 - Use Ctrl+Alt+D hotkey to switch to DNA, reload the page, and verify DNA is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Use Ctrl+Alt+D hotkey to switch to DNA, reload the page, and verify DNA is restored from cache
     * Scenario:
     * 1. Switch to macromolecules mode
     * 2. Use Ctrl+Alt+D hotkey to switch to DNA
     * 3. Verify DNA is selected
     * 4. Reload the page
     * 5. Switch back to macromolecules mode
     * 6. Verify DNA is restored from cache
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await page.keyboard.press('Control+Alt+D');
    
    // Verify DNA button is active
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    await expect(dnaButton).toHaveAttribute('data-teststate', 'active');
    
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify DNA is restored from cache
    await expect(dnaButton).toHaveAttribute('data-teststate', 'active');
    
    await takeEditorScreenshot(page);
  });

  test('Case 6 - Use Ctrl+Alt+P hotkey to switch to PEP, reload the page, and verify PEP is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Use Ctrl+Alt+P hotkey to switch to PEP, reload the page, and verify PEP is restored from cache
     * Scenario:
     * 1. Switch to macromolecules mode
     * 2. Use Ctrl+Alt+P hotkey to switch to PEP
     * 3. Verify PEP is selected
     * 4. Reload the page
     * 5. Switch back to macromolecules mode
     * 6. Verify PEP is restored from cache
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await page.keyboard.press('Control+Alt+P');
    
    // Verify PEP button is active
    const pepButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(pepButton).toHaveAttribute('data-teststate', 'active');
    
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify PEP is restored from cache
    await expect(pepButton).toHaveAttribute('data-teststate', 'active');
    
    await takeEditorScreenshot(page);
  });

  test('Case 7 - Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache
     * Scenario:
     * 1. Switch to macromolecules mode
     * 2. Select DNA first to change from default
     * 3. Use Ctrl+Alt+R hotkey to switch to RNA
     * 4. Verify RNA is selected
     * 5. Reload the page
     * 6. Switch back to macromolecules mode
     * 7. Verify RNA is restored from cache
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).dna(); // Change from default
    await page.keyboard.press('Control+Alt+R');
    
    // Verify RNA button is active
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-teststate', 'active');
    
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify RNA is restored from cache
    await expect(rnaButton).toHaveAttribute('data-teststate', 'active');
    
    await takeEditorScreenshot(page);
  });

  test('Case 8 - Change the polymer type by switching the library tab, reload the page, and verify the cached type matches the last library tab used', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Change the polymer type by switching the library tab, reload the page, and verify the cached type matches the last library tab used
     * Scenario:
     * 1. Switch to macromolecules mode
     * 2. Switch to peptides library tab
     * 3. Verify polymer type switches to PEP
     * 4. Reload the page
     * 5. Switch back to macromolecules mode
     * 6. Verify the cached polymer type is PEP
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await Library(page).switchToPeptidesTab();
    
    // Verify PEP button is active
    const pepButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(pepButton).toHaveAttribute('data-teststate', 'active');
    
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify PEP is restored from cache
    await expect(pepButton).toHaveAttribute('data-teststate', 'active');
    
    // Verify Peptides library tab is opened
    const peptidesTab = page.getByTestId(LibraryTab.Peptides);
    await expect(peptidesTab).toHaveAttribute('aria-selected', 'true');
    
    await takeEditorScreenshot(page);
  });

  test('Case 9 - Switch to PEP, reload the page, enter flex mode, and verify the peptide library tab is opened by default despite switcher not being visible', async ({ FlexCanvas: _ }) => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Switch to PEP, reload the page, enter flex mode, and verify the peptide library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Switch to macromolecules mode
     * 2. Select PEP via the polymer type switcher
     * 3. Reload the page
     * 4. Switch to macromolecules mode
     * 5. Switch to flex mode
     * 6. Verify peptide library tab is opened despite switcher not being visible
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).peptides();
    
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Flex);
    
    // Verify Peptides library tab is opened in flex mode
    const peptidesTab = page.getByTestId(LibraryTab.Peptides);
    await expect(peptidesTab).toHaveAttribute('aria-selected', 'true');
    
    await takeEditorScreenshot(page);
  });

  test('Case 10 - Switch to DNA, reload the page, enter snake mode, and verify the DNA library tab is opened by default despite switcher not being visible', async ({ SnakeCanvas: _ }) => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Switch to DNA, reload the page, enter snake mode, and verify the DNA library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Switch to macromolecules mode
     * 2. Select DNA via the polymer type switcher
     * 3. Reload the page
     * 4. Switch to macromolecules mode
     * 5. Switch to snake mode
     * 6. Verify DNA library tab is opened despite switcher not being visible
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).dna();
    
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Snake);
    
    // Verify DNA library tab is opened in snake mode
    const dnaTab = page.getByTestId(LibraryTab.DNA);
    await expect(dnaTab).toHaveAttribute('aria-selected', 'true');
    
    await takeEditorScreenshot(page);
  });

  test('Case 11 - Clear browser cache/localStorage, open macromolecule mode, and verify RNA is selected as the fallback default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Clear browser cache/localStorage, open macromolecule mode, and verify RNA is selected as the fallback default
     * Scenario:
     * 1. Switch to macromolecules mode and select DNA
     * 2. Clear localStorage explicitly
     * 3. Reload the page
     * 4. Switch to macromolecules mode
     * 5. Verify RNA is selected as fallback default
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).dna(); // Set DNA first
    
    // Clear localStorage explicitly
    await clearLocalStorage(page);
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify RNA is selected as default fallback
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-teststate', 'active');
    
    // Verify RNA library tab is opened
    const rnaTab = Library(page).rnaTab;
    await expect(rnaTab).toHaveAttribute('aria-selected', 'true');
    
    await takeEditorScreenshot(page);
  });

  test('Case 12 - Verify that switching polymer type in one browser tab and opening a new tab reflects the cached value in the new tab', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Verify that switching polymer type in one browser tab and opening a new tab reflects the cached value in the new tab
     * Scenario:
     * 1. Switch to macromolecules mode
     * 2. Select DNA via the polymer type switcher
     * 3. Open a new tab/context
     * 4. Navigate to Ketcher in the new tab
     * 5. Switch to macromolecules mode
     * 6. Verify DNA is selected from cache in the new tab
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).dna();
    
    // Verify DNA button is active in first tab
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    await expect(dnaButton).toHaveAttribute('data-teststate', 'active');
    
    // Create a new page context to simulate opening a new tab
    const newPage = await page.context().newPage();
    await newPage.goto(page.url());
    await newPage.waitForLoadState('domcontentloaded');
    
    // Switch to macromolecules mode in new tab
    await CommonTopRightToolbar(newPage).turnOnMacromoleculesEditor();
    
    // Verify DNA is selected from cache in new tab
    const newTabDnaButton = MacromoleculesTopToolbar(newPage).dnaButton;
    await expect(newTabDnaButton).toHaveAttribute('data-teststate', 'active');
    
    await newPage.close();
    await takeEditorScreenshot(page);
  });

  test('Case 13 - Switch polymer type multiple times in sequence (RNA → DNA → PEP → DNA), reload, and verify only the last selected type (DNA) is restored', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Switch polymer type multiple times in sequence, reload, and verify only the last selected type is restored
     * Scenario:
     * 1. Switch to macromolecules mode
     * 2. Switch polymer types in sequence: RNA → DNA → PEP → DNA
     * 3. Reload the page
     * 4. Switch to macromolecules mode
     * 5. Verify only the last selected type (DNA) is restored
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Switch through polymer types in sequence
    await MacromoleculesTopToolbar(page).rna();
    await MacromoleculesTopToolbar(page).dna();
    await MacromoleculesTopToolbar(page).peptides();
    await MacromoleculesTopToolbar(page).dna(); // Final selection
    
    // Verify DNA button is active
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    await expect(dnaButton).toHaveAttribute('data-teststate', 'active');
    
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify only the last selected type (DNA) is restored
    await expect(dnaButton).toHaveAttribute('data-teststate', 'active');
    
    // Verify DNA library tab is opened
    const dnaTab = page.getByTestId(LibraryTab.DNA);
    await expect(dnaTab).toHaveAttribute('aria-selected', 'true');
    
    await takeEditorScreenshot(page);
  });

  test('Case 14 - Verify that the cached polymer type persists after navigating away from macromolecule mode to small molecule mode and back', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Verify that the cached polymer type persists after navigating away from macromolecule mode to small molecule mode and back
     * Scenario:
     * 1. Switch to macromolecules mode
     * 2. Select DNA via the polymer type switcher
     * 3. Switch to small molecule mode
     * 4. Switch back to macromolecules mode
     * 5. Verify DNA is still selected from cache
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).dna();
    
    // Verify DNA button is active
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    await expect(dnaButton).toHaveAttribute('data-teststate', 'active');
    
    // Switch to small molecule mode
    await CommonTopRightToolbar(page).turnOnMicromoleculesEditor();
    
    // Switch back to macromolecules mode
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify DNA is still selected from cache
    await expect(dnaButton).toHaveAttribute('data-teststate', 'active');
    
    // Verify DNA library tab is opened
    const dnaTab = page.getByTestId(LibraryTab.DNA);
    await expect(dnaTab).toHaveAttribute('aria-selected', 'true');
    
    await takeEditorScreenshot(page);
  });

  test('Case 15 - Verify that an invalid or corrupted cache value for polymer type falls back gracefully to the RNA default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Verify that an invalid or corrupted cache value for polymer type falls back gracefully to the RNA default
     * Scenario:
     * 1. Set an invalid polymer type value in localStorage
     * 2. Reload the page
     * 3. Switch to macromolecules mode
     * 4. Verify the system gracefully falls back to RNA default
     *
     * Version 3.15.0
     */
    // Set an invalid polymer type value in localStorage
    await page.evaluate(() => {
      localStorage.setItem('ketcher-polymer-type', 'INVALID_TYPE');
    });
    
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify system falls back to RNA default
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-teststate', 'active');
    
    // Verify RNA library tab is opened
    const rnaTab = Library(page).rnaTab;
    await expect(rnaTab).toHaveAttribute('aria-selected', 'true');
    
    // Verify the invalid value was corrected or cleared
    const cachedValue = await page.evaluate(() => 
      localStorage.getItem('ketcher-polymer-type')
    );
    expect(cachedValue).not.toBe('INVALID_TYPE');
    
    await takeEditorScreenshot(page);
  });

  test('Case 16 - Verify localStorage key and value structure for polymer type caching', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Verify localStorage key and value structure for polymer type caching
     * Scenario:
     * 1. Switch to macromolecules mode
     * 2. Select DNA via the polymer type switcher
     * 3. Verify the correct localStorage key and value are set
     * 4. Test with different polymer types
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Test DNA selection
    await MacromoleculesTopToolbar(page).dna();
    let cachedValue = await page.evaluate(() => 
      localStorage.getItem('ketcher-polymer-type') || 
      localStorage.getItem('polymerType') ||
      localStorage.getItem('selectedPolymerType')
    );
    expect(cachedValue).toContain('DNA');
    
    // Test PEP selection
    await MacromoleculesTopToolbar(page).peptides();
    cachedValue = await page.evaluate(() => 
      localStorage.getItem('ketcher-polymer-type') || 
      localStorage.getItem('polymerType') ||
      localStorage.getItem('selectedPolymerType')
    );
    expect(cachedValue).toContain('PEP');
    
    // Test RNA selection
    await MacromoleculesTopToolbar(page).rna();
    cachedValue = await page.evaluate(() => 
      localStorage.getItem('ketcher-polymer-type') || 
      localStorage.getItem('polymerType') ||
      localStorage.getItem('selectedPolymerType')
    );
    expect(cachedValue).toContain('RNA');
  });
});