import { Page, test, expect } from '@fixtures';
import { CommonTopRightToolbar } from '@tests/pages/common/CommonTopRightToolbar';
import { MacromoleculesTopToolbar } from '@tests/pages/macromolecules/MacromoleculesTopToolbar';
import { LayoutMode } from '@tests/pages/constants/macromoleculesTopToolbar/Constants';
import { clearLocalStorage, pageReload } from '@utils/common/helpers';
import { Library } from '@tests/pages/macromolecules/Library';
import { keyboardPressOnCanvas } from '@utils/keyboard';

let page: Page;

test.describe('Polymer Type Switcher Cache Persistence', () => {
  test.beforeAll(async ({ initFlexCanvas }) => {
    page = await initFlexCanvas();
  });

  test.afterAll(async ({ closePage }) => {
    await closePage();
  });

  test.beforeEach(async () => {
    // Clear localStorage before each test to ensure clean state
    await clearLocalStorage(page);
    await pageReload(page);
  });

  test('Case 1 - When no cached value exists, verify that switching to macromolecule mode defaults to RNA polymer type', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: When no cached value exists, verify that switching to macromolecule mode defaults to RNA polymer type
     * Scenario:
     * 1. Clear localStorage to simulate no cached value
     * 2. Switch to macromolecule mode
     * 3. Verify RNA polymer type is selected by default
     *
     * Version 3.14.0
     */
    // Verify RNA button is active by default when no cache exists
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-isactive', 'true');
    
    // Also verify that RNA library tab is opened
    const rnaLibraryTab = Library(page).rnaTab;
    await expect(rnaLibraryTab).toHaveAttribute('aria-selected', 'true');
    
    // Verify localStorage contains RNA as the polymer type
    const polymerType = await page.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(polymerType).toBe('RNA');
  });

  test('Case 2 - Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected
     * Scenario:
     * 1. Select DNA via polymer type switcher
     * 2. Reload the page
     * 3. Verify DNA is selected after reload
     *
     * Version 3.14.0
     */
    // Select DNA polymer type
    await MacromoleculesTopToolbar(page).dna();
    
    // Verify DNA is selected and cached
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    await expect(dnaButton).toHaveAttribute('data-isactive', 'true');
    
    // Verify cache contains DNA
    let polymerType = await page.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(polymerType).toBe('DNA');
    
    // Reload page
    await pageReload(page);
    
    // Verify DNA is still selected after reload
    await expect(dnaButton).toHaveAttribute('data-isactive', 'true');
    
    // Verify cache still contains DNA
    polymerType = await page.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(polymerType).toBe('DNA');
  });

  test('Case 3 - Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected
     * Scenario:
     * 1. Select PEP via polymer type switcher
     * 2. Reload the page
     * 3. Verify PEP is selected after reload
     *
     * Version 3.14.0
     */
    // Select PEP polymer type
    await MacromoleculesTopToolbar(page).peptides();
    
    // Verify PEP is selected and cached
    const pepButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(pepButton).toHaveAttribute('data-isactive', 'true');
    
    // Verify cache contains PEP
    let polymerType = await page.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(polymerType).toBe('PEPTIDE');
    
    // Reload page
    await pageReload(page);
    
    // Verify PEP is still selected after reload
    await expect(pepButton).toHaveAttribute('data-isactive', 'true');
    
    // Verify cache still contains PEP
    polymerType = await page.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(polymerType).toBe('PEPTIDE');
  });

  test('Case 4 - Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected
     * Scenario:
     * 1. Start with DNA selected
     * 2. Explicitly select RNA via polymer type switcher
     * 3. Reload the page
     * 4. Verify RNA is selected after reload
     *
     * Version 3.14.0
     */
    // First select DNA to change from default
    await MacromoleculesTopToolbar(page).dna();
    
    // Then explicitly select RNA
    await MacromoleculesTopToolbar(page).rna();
    
    // Verify RNA is selected and cached
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-isactive', 'true');
    
    // Verify cache contains RNA
    let polymerType = await page.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(polymerType).toBe('RNA');
    
    // Reload page
    await pageReload(page);
    
    // Verify RNA is still selected after reload
    await expect(rnaButton).toHaveAttribute('data-isactive', 'true');
    
    // Verify cache still contains RNA
    polymerType = await page.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(polymerType).toBe('RNA');
  });

  test('Case 5 - Use Ctrl+Alt+D hotkey to switch to DNA, reload the page, and verify DNA is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Use Ctrl+Alt+D hotkey to switch to DNA, reload the page, and verify DNA is restored from cache
     * Scenario:
     * 1. Use Ctrl+Alt+D hotkey to switch to DNA
     * 2. Reload the page
     * 3. Verify DNA is restored from cache
     *
     * Version 3.14.0
     */
    // Use hotkey to switch to DNA
    await keyboardPressOnCanvas(page, 'Control+Alt+d');
    
    // Verify DNA is selected and cached
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    await expect(dnaButton).toHaveAttribute('data-isactive', 'true');
    
    // Verify cache contains DNA
    let polymerType = await page.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(polymerType).toBe('DNA');
    
    // Reload page
    await pageReload(page);
    
    // Verify DNA is still selected after reload
    await expect(dnaButton).toHaveAttribute('data-isactive', 'true');
    
    // Verify cache still contains DNA
    polymerType = await page.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(polymerType).toBe('DNA');
  });

  test('Case 6 - Use Ctrl+Alt+P hotkey to switch to PEP, reload the page, and verify PEP is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Use Ctrl+Alt+P hotkey to switch to PEP, reload the page, and verify PEP is restored from cache
     * Scenario:
     * 1. Use Ctrl+Alt+P hotkey to switch to PEP
     * 2. Reload the page
     * 3. Verify PEP is restored from cache
     *
     * Version 3.14.0
     */
    // Use hotkey to switch to PEP
    await keyboardPressOnCanvas(page, 'Control+Alt+p');
    
    // Verify PEP is selected and cached
    const pepButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(pepButton).toHaveAttribute('data-isactive', 'true');
    
    // Verify cache contains PEP
    let polymerType = await page.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(polymerType).toBe('PEPTIDE');
    
    // Reload page
    await pageReload(page);
    
    // Verify PEP is still selected after reload
    await expect(pepButton).toHaveAttribute('data-isactive', 'true');
    
    // Verify cache still contains PEP
    polymerType = await page.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(polymerType).toBe('PEPTIDE');
  });

  test('Case 7 - Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache
     * Scenario:
     * 1. Start with DNA selected
     * 2. Use Ctrl+Alt+R hotkey to switch to RNA
     * 3. Reload the page
     * 4. Verify RNA is restored from cache
     *
     * Version 3.14.0
     */
    // First select DNA to change from default
    await MacromoleculesTopToolbar(page).dna();
    
    // Use hotkey to switch to RNA
    await keyboardPressOnCanvas(page, 'Control+Alt+r');
    
    // Verify RNA is selected and cached
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-isactive', 'true');
    
    // Verify cache contains RNA
    let polymerType = await page.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(polymerType).toBe('RNA');
    
    // Reload page
    await pageReload(page);
    
    // Verify RNA is still selected after reload
    await expect(rnaButton).toHaveAttribute('data-isactive', 'true');
    
    // Verify cache still contains RNA
    polymerType = await page.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(polymerType).toBe('RNA');
  });

  test('Case 8 - Change the polymer type by switching the library tab, reload the page, and verify the cached type matches the last library tab used', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Change the polymer type by switching the library tab, reload the page, and verify the cached type matches the last library tab used
     * Scenario:
     * 1. Switch to peptides library tab
     * 2. Reload the page
     * 3. Verify the cached type matches the peptides tab
     *
     * Version 3.14.0
     */
    // Switch to peptides library tab
    const peptidesTab = Library(page).peptidesTab;
    await peptidesTab.click();
    
    // Verify PEP button is now active
    const pepButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(pepButton).toHaveAttribute('data-isactive', 'true');
    
    // Verify cache contains PEP
    let polymerType = await page.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(polymerType).toBe('PEPTIDE');
    
    // Reload page
    await pageReload(page);
    
    // Verify PEP is still selected after reload
    await expect(pepButton).toHaveAttribute('data-isactive', 'true');
    
    // Verify peptides library tab is opened
    await expect(peptidesTab).toHaveAttribute('aria-selected', 'true');
    
    // Verify cache still contains PEP
    polymerType = await page.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(polymerType).toBe('PEPTIDE');
  });

  test('Case 9 - Switch to PEP, reload the page, enter flex mode, and verify the peptide library tab is opened by default despite switcher not being visible', async ({ FlexCanvas: _ }) => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Switch to PEP, reload the page, enter flex mode, and verify the peptide library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Switch to PEP
     * 2. Reload the page
     * 3. Enter flex mode
     * 4. Verify peptide library tab is opened despite switcher not being visible
     *
     * Version 3.14.0
     */
    // Switch to PEP
    await MacromoleculesTopToolbar(page).peptides();
    
    // Reload page
    await pageReload(page);
    
    // Enter flex mode
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Flex);
    
    // Verify peptide library tab is opened by default
    const peptidesTab = Library(page).peptidesTab;
    await expect(peptidesTab).toBeVisible();
    
    // Verify cache still contains PEP
    const polymerType = await page.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(polymerType).toBe('PEPTIDE');
  });

  test('Case 10 - Switch to DNA, reload the page, enter snake mode, and verify the DNA library tab is opened by default despite switcher not being visible', async ({ SnakeCanvas: _ }) => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Switch to DNA, reload the page, enter snake mode, and verify the DNA library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Switch to DNA
     * 2. Reload the page
     * 3. Enter snake mode
     * 4. Verify DNA library tab is opened despite switcher not being visible
     *
     * Version 3.14.0
     */
    // Switch to DNA
    await MacromoleculesTopToolbar(page).dna();
    
    // Reload page
    await pageReload(page);
    
    // Enter snake mode
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Snake);
    
    // Verify RNA library tab is opened by default (DNA uses RNA tab)
    const rnaTab = Library(page).rnaTab;
    await expect(rnaTab).toHaveAttribute('aria-selected', 'true');
    
    // Verify cache still contains DNA
    const polymerType = await page.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(polymerType).toBe('DNA');
  });

  test('Case 11 - Clear browser cache/localStorage, open macromolecule mode, and verify RNA is selected as the fallback default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Clear browser cache/localStorage, open macromolecule mode, and verify RNA is selected as the fallback default
     * Scenario:
     * 1. Select DNA to change from default
     * 2. Clear localStorage completely
     * 3. Reload page and switch to macromolecule mode
     * 4. Verify RNA is selected as fallback default
     *
     * Version 3.14.0
     */
    // First select DNA
    await MacromoleculesTopToolbar(page).dna();
    
    // Clear localStorage completely
    await clearLocalStorage(page);
    
    // Reload page
    await pageReload(page);
    
    // Verify RNA is selected as default fallback
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-isactive', 'true');
    
    // Verify RNA library tab is opened
    const rnaLibraryTab = Library(page).rnaTab;
    await expect(rnaLibraryTab).toHaveAttribute('aria-selected', 'true');
    
    // Verify cache now contains RNA
    const polymerType = await page.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(polymerType).toBe('RNA');
  });

  test('Case 12 - Verify that switching polymer type in one browser tab and opening a new tab reflects the cached value in the new tab', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Verify that switching polymer type in one browser tab and opening a new tab reflects the cached value in the new tab
     * Scenario:
     * 1. Switch to DNA in current tab
     * 2. Open a new tab with Ketcher
     * 3. Verify DNA is selected in the new tab
     *
     * Version 3.14.0
     */
    // Switch to DNA in current tab
    await MacromoleculesTopToolbar(page).dna();
    
    // Verify DNA is cached
    let polymerType = await page.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(polymerType).toBe('DNA');
    
    // Open new tab/page (simulate by creating new page instance)
    const newPage = await page.context().newPage();
    await newPage.goto('/');
    
    // Set up new page like our fixture would
    const { waitForKetcherInit } = await import('@utils/common/loaders/waitForKetcherInit/waitForKetcherInit');
    await waitForKetcherInit(newPage);
    await CommonTopRightToolbar(newPage).turnOnMacromoleculesEditor();
    
    // Verify DNA is selected in new tab
    const dnaButtonNewTab = MacromoleculesTopToolbar(newPage).dnaButton;
    await expect(dnaButtonNewTab).toHaveAttribute('data-isactive', 'true');
    
    // Verify cache contains DNA in new tab
    polymerType = await newPage.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(polymerType).toBe('DNA');
    
    // Close new tab
    await newPage.close();
  });

  test('Case 13 - Switch polymer type multiple times in sequence (RNA → DNA → PEP → DNA), reload, and verify only the last selected type (DNA) is restored', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Switch polymer type multiple times in sequence, reload, and verify only the last selected type is restored
     * Scenario:
     * 1. Switch RNA → DNA → PEP → DNA in sequence
     * 2. Reload page
     * 3. Verify only the last selected type (DNA) is restored
     *
     * Version 3.14.0
     */
    // Start with RNA (default), then switch to DNA
    await MacromoleculesTopToolbar(page).dna();
    
    // Switch to PEP
    await MacromoleculesTopToolbar(page).peptides();
    
    // Switch back to DNA (final state)
    await MacromoleculesTopToolbar(page).dna();
    
    // Verify DNA is selected and cached
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    await expect(dnaButton).toHaveAttribute('data-isactive', 'true');
    
    // Verify cache contains DNA
    let polymerType = await page.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(polymerType).toBe('DNA');
    
    // Reload page
    await pageReload(page);
    
    // Verify only the last selected type (DNA) is restored
    await expect(dnaButton).toHaveAttribute('data-isactive', 'true');
    
    // Verify cache still contains only DNA
    polymerType = await page.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(polymerType).toBe('DNA');
  });

  test('Case 14 - Verify that the cached polymer type persists after navigating away from macromolecule mode to small molecule mode and back', async ({ MoleculesCanvas: _ }) => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Verify that the cached polymer type persists after navigating away from macromolecule mode to small molecule mode and back
     * Scenario:
     * 1. Switch to DNA in macromolecule mode
     * 2. Switch to small molecule mode
     * 3. Switch back to macromolecule mode
     * 4. Verify DNA is still selected
     *
     * Version 3.14.0
     */
    // Switch to DNA in macromolecule mode
    await MacromoleculesTopToolbar(page).dna();
    
    // Verify DNA is cached
    let polymerType = await page.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(polymerType).toBe('DNA');
    
    // Switch to small molecule mode
    await CommonTopRightToolbar(page).turnOnMicromoleculesEditor();
    
    // Switch back to macromolecule mode
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify DNA is still selected
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    await expect(dnaButton).toHaveAttribute('data-isactive', 'true');
    
    // Verify cache still contains DNA
    polymerType = await page.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(polymerType).toBe('DNA');
  });

  test('Case 15 - Verify that an invalid or corrupted cache value for polymer type falls back gracefully to the RNA default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Verify that an invalid or corrupted cache value for polymer type falls back gracefully to the RNA default
     * Scenario:
     * 1. Set an invalid/corrupted value in localStorage
     * 2. Reload page and switch to macromolecule mode
     * 3. Verify RNA is selected as fallback default
     *
     * Version 3.14.0
     */
    // Set invalid/corrupted value in localStorage
    await page.evaluate(() => {
      localStorage.setItem('ketcher-polymer-type', 'INVALID_TYPE');
    });
    
    // Reload page
    await pageReload(page);
    
    // Verify RNA is selected as fallback default
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-isactive', 'true');
    
    // Verify RNA library tab is opened
    const rnaLibraryTab = Library(page).rnaTab;
    await expect(rnaLibraryTab).toHaveAttribute('aria-selected', 'true');
    
    // Verify cache is corrected to RNA
    const polymerType = await page.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(polymerType).toBe('RNA');
  });
});