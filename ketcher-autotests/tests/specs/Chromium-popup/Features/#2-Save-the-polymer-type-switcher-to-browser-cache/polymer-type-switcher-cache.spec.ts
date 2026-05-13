import { Page, test, expect } from '@fixtures';
import { CommonTopRightToolbar } from '@tests/pages/common/CommonTopRightToolbar';
import { MacromoleculesTopToolbar } from '@tests/pages/macromolecules/MacromoleculesTopToolbar';
import { Library } from '@tests/pages/macromolecules/Library';
import { LayoutMode } from '@tests/pages/constants/macromoleculesTopToolbar/Constants';
import { pageReload, clearLocalStorage } from '@utils/common/helpers';

let page: Page;

test.describe('Autotests: Save the polymer type switcher (RNA/DNA/PEP) to browser cache', () => {
  test.beforeAll(async ({ initFlexCanvas }) => {
    page = await initFlexCanvas();
  });

  test.afterAll(async ({ closePage }) => {
    await closePage();
  });

  test('Case 1 - When no cached value exists, verify that switching to macromolecule mode defaults to RNA polymer type', async () => {
    /*
     * Test task: https://github.com/epam/ketcher/issues/8
     * Description: When no cached value exists, verify that switching to macromolecule mode defaults to RNA polymer type
     * Scenario:
     * 1. Clear browser cache/localStorage
     * 2. Switch to micro mode
     * 3. Switch back to macro mode
     * 4. Verify RNA is selected as default
     *
     * Version 3.14.0
     */
    
    // Clear localStorage to ensure no cached value exists
    await clearLocalStorage(page);
    
    // Switch to micro mode
    await CommonTopRightToolbar(page).turnOnMicromoleculesEditor();
    
    // Switch back to macro mode
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify RNA button is active by default
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-testid', 'RNABtn');
    await expect(rnaButton).toHaveClass(/.*active.*/);
    
    // Verify RNA library tab is visible
    await expect(page.getByTestId('RNA-bases-tab')).toBeVisible();
  });

  test('Case 2 - Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected', async () => {
    /*
     * Test task: https://github.com/epam/ketcher/issues/8
     * Description: Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected
     * Scenario:
     * 1. Switch to DNA via polymer type switcher
     * 2. Reload the page
     * 3. Verify macromolecule mode reopens with DNA selected
     *
     * Version 3.14.0
     */
    
    // Clear localStorage first to start fresh
    await clearLocalStorage(page);
    await pageReload(page);
    
    // Select DNA via polymer type switcher
    await MacromoleculesTopToolbar(page).dna();
    
    // Reload the page
    await pageReload(page);
    
    // Verify DNA button is active after reload
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    await expect(dnaButton).toHaveAttribute('data-testid', 'DNABtn');
    await expect(dnaButton).toHaveClass(/.*active.*/);
    
    // Verify DNA library tab is visible
    await expect(page.getByTestId('DNA-bases-tab')).toBeVisible();
  });

  test('Case 3 - Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected', async () => {
    /*
     * Test task: https://github.com/epam/ketcher/issues/8
     * Description: Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected
     * Scenario:
     * 1. Switch to PEP via polymer type switcher
     * 2. Reload the page
     * 3. Verify macromolecule mode reopens with PEP selected
     *
     * Version 3.14.0
     */
    
    // Clear localStorage first to start fresh
    await clearLocalStorage(page);
    await pageReload(page);
    
    // Select Peptides via polymer type switcher
    await MacromoleculesTopToolbar(page).peptides();
    
    // Reload the page
    await pageReload(page);
    
    // Verify Peptides button is active after reload
    const peptidesButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(peptidesButton).toHaveAttribute('data-testid', 'PEPTIDEBtn');
    await expect(peptidesButton).toHaveClass(/.*active.*/);
    
    // Verify Peptides library tab is visible
    await expect(page.getByTestId('A')).toBeVisible(); // Alanine is first in peptide library
  });

  test('Case 4 - Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected', async () => {
    /*
     * Test task: https://github.com/epam/ketcher/issues/8
     * Description: Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected
     * Scenario:
     * 1. Switch to DNA first
     * 2. Switch to RNA explicitly via polymer type switcher
     * 3. Reload the page
     * 4. Verify macromolecule mode reopens with RNA selected
     *
     * Version 3.14.0
     */
    
    // Clear localStorage first to start fresh
    await clearLocalStorage(page);
    await pageReload(page);
    
    // Switch to DNA first to change from default
    await MacromoleculesTopToolbar(page).dna();
    
    // Then explicitly select RNA
    await MacromoleculesTopToolbar(page).rna();
    
    // Reload the page
    await pageReload(page);
    
    // Verify RNA button is active after reload
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-testid', 'RNABtn');
    await expect(rnaButton).toHaveClass(/.*active.*/);
    
    // Verify RNA library tab is visible
    await expect(page.getByTestId('RNA-bases-tab')).toBeVisible();
  });

  test('Case 5 - Use Ctrl+Alt+D hotkey to switch to DNA, reload the page, and verify DNA is restored from cache', async () => {
    /*
     * Test task: https://github.com/epam/ketcher/issues/8
     * Description: Use Ctrl+Alt+D hotkey to switch to DNA, reload the page, and verify DNA is restored from cache
     * Scenario:
     * 1. Use Ctrl+Alt+D hotkey to switch to DNA
     * 2. Reload the page
     * 3. Verify DNA is restored from cache
     *
     * Version 3.14.0
     */
    
    // Clear localStorage first to start fresh
    await clearLocalStorage(page);
    await pageReload(page);
    
    // Use Ctrl+Alt+D hotkey to switch to DNA
    await page.keyboard.down('Control');
    await page.keyboard.down('Alt');
    await page.keyboard.press('KeyD');
    await page.keyboard.up('Alt');
    await page.keyboard.up('Control');
    
    // Wait for DNA to be selected
    await page.waitForTimeout(500);
    
    // Reload the page
    await pageReload(page);
    
    // Verify DNA button is active after reload
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    await expect(dnaButton).toHaveAttribute('data-testid', 'DNABtn');
    await expect(dnaButton).toHaveClass(/.*active.*/);
    
    // Verify DNA library tab is visible
    await expect(page.getByTestId('DNA-bases-tab')).toBeVisible();
  });

  test('Case 6 - Use Ctrl+Alt+P hotkey to switch to PEP, reload the page, and verify PEP is restored from cache', async () => {
    /*
     * Test task: https://github.com/epam/ketcher/issues/8
     * Description: Use Ctrl+Alt+P hotkey to switch to PEP, reload the page, and verify PEP is restored from cache
     * Scenario:
     * 1. Use Ctrl+Alt+P hotkey to switch to PEP
     * 2. Reload the page
     * 3. Verify PEP is restored from cache
     *
     * Version 3.14.0
     */
    
    // Clear localStorage first to start fresh
    await clearLocalStorage(page);
    await pageReload(page);
    
    // Use Ctrl+Alt+P hotkey to switch to Peptides
    await page.keyboard.down('Control');
    await page.keyboard.down('Alt');
    await page.keyboard.press('KeyP');
    await page.keyboard.up('Alt');
    await page.keyboard.up('Control');
    
    // Wait for Peptides to be selected
    await page.waitForTimeout(500);
    
    // Reload the page
    await pageReload(page);
    
    // Verify Peptides button is active after reload
    const peptidesButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(peptidesButton).toHaveAttribute('data-testid', 'PEPTIDEBtn');
    await expect(peptidesButton).toHaveClass(/.*active.*/);
    
    // Verify Peptides library tab is visible
    await expect(page.getByTestId('A')).toBeVisible(); // Alanine is first in peptide library
  });

  test('Case 7 - Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache', async () => {
    /*
     * Test task: https://github.com/epam/ketcher/issues/8
     * Description: Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache
     * Scenario:
     * 1. Switch to DNA first
     * 2. Use Ctrl+Alt+R hotkey to switch to RNA
     * 3. Reload the page
     * 4. Verify RNA is restored from cache
     *
     * Version 3.14.0
     */
    
    // Clear localStorage first to start fresh
    await clearLocalStorage(page);
    await pageReload(page);
    
    // Switch to DNA first to change from default
    await MacromoleculesTopToolbar(page).dna();
    
    // Use Ctrl+Alt+R hotkey to switch to RNA
    await page.keyboard.down('Control');
    await page.keyboard.down('Alt');
    await page.keyboard.press('KeyR');
    await page.keyboard.up('Alt');
    await page.keyboard.up('Control');
    
    // Wait for RNA to be selected
    await page.waitForTimeout(500);
    
    // Reload the page
    await pageReload(page);
    
    // Verify RNA button is active after reload
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-testid', 'RNABtn');
    await expect(rnaButton).toHaveClass(/.*active.*/);
    
    // Verify RNA library tab is visible
    await expect(page.getByTestId('RNA-bases-tab')).toBeVisible();
  });

  test('Case 8 - Change the polymer type by switching the library tab, reload the page, and verify the cached type matches the last library tab used', async () => {
    /*
     * Test task: https://github.com/epam/ketcher/issues/8
     * Description: Change the polymer type by switching the library tab, reload the page, and verify the cached type matches the last library tab used
     * Scenario:
     * 1. Switch to peptides library tab
     * 2. Reload the page
     * 3. Verify the cached type matches peptides
     *
     * Version 3.14.0
     */
    
    // Clear localStorage first to start fresh
    await clearLocalStorage(page);
    await pageReload(page);
    
    // Switch to Peptides via library tab
    await Library(page).clickTab('Peptides');
    
    // Wait for library to load
    await page.waitForTimeout(500);
    
    // Reload the page
    await pageReload(page);
    
    // Verify Peptides button is active after reload
    const peptidesButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(peptidesButton).toHaveAttribute('data-testid', 'PEPTIDEBtn');
    await expect(peptidesButton).toHaveClass(/.*active.*/);
    
    // Verify Peptides library tab is visible
    await expect(page.getByTestId('A')).toBeVisible(); // Alanine is first in peptide library
  });

  test('Case 9 - Switch to PEP, reload the page, enter flex mode, and verify the peptide library tab is opened by default despite switcher not being visible', async ({ FlexCanvas: _ }) => {
    /*
     * Test task: https://github.com/epam/ketcher/issues/8
     * Description: Switch to PEP, reload the page, enter flex mode, and verify the peptide library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Switch to PEP
     * 2. Reload the page
     * 3. Enter flex mode
     * 4. Verify peptide library tab is opened by default
     *
     * Version 3.14.0
     */
    
    // Clear localStorage first to start fresh
    await clearLocalStorage(page);
    await pageReload(page);
    
    // Switch to Peptides
    await MacromoleculesTopToolbar(page).peptides();
    
    // Reload the page
    await pageReload(page);
    
    // We're already in flex mode, so verify Peptides library is active
    await expect(page.getByTestId('A')).toBeVisible(); // Alanine should be visible
    
    // Verify peptides tab is active in library
    const peptidesTab = page.getByRole('tab', { name: 'Peptides' });
    await expect(peptidesTab).toHaveClass(/.*active.*/);
  });

  test('Case 10 - Switch to DNA, reload the page, enter snake mode, and verify the DNA library tab is opened by default despite switcher not being visible', async ({ SnakeCanvas: _ }) => {
    /*
     * Test task: https://github.com/epam/ketcher/issues/8
     * Description: Switch to DNA, reload the page, enter snake mode, and verify the DNA library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Switch to DNA
     * 2. Reload the page
     * 3. Enter snake mode
     * 4. Verify DNA library tab is opened by default
     *
     * Version 3.14.0
     */
    
    // Clear localStorage first to start fresh
    await clearLocalStorage(page);
    await pageReload(page);
    
    // Switch to DNA
    await MacromoleculesTopToolbar(page).dna();
    
    // Reload the page
    await pageReload(page);
    
    // Switch to snake mode
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Snake);
    
    // Verify DNA library is active
    const dnaBasesTab = page.getByTestId('DNA-bases-tab');
    await expect(dnaBasesTab).toBeVisible();
    
    // Verify DNA bases are visible in library
    await expect(page.getByTestId('dA')).toBeVisible(); // DNA Adenine should be visible
  });

  test('Case 11 - Clear browser cache/localStorage, open macromolecule mode, and verify RNA is selected as the fallback default', async () => {
    /*
     * Test task: https://github.com/epam/ketcher/issues/8
     * Description: Clear browser cache/localStorage, open macromolecule mode, and verify RNA is selected as the fallback default
     * Scenario:
     * 1. Clear browser cache/localStorage
     * 2. Open macromolecule mode
     * 3. Verify RNA is selected as fallback default
     *
     * Version 3.14.0
     */
    
    // Clear localStorage
    await clearLocalStorage(page);
    
    // Switch to micro mode and back to ensure fresh state
    await CommonTopRightToolbar(page).turnOnMicromoleculesEditor();
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify RNA button is active by default
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-testid', 'RNABtn');
    await expect(rnaButton).toHaveClass(/.*active.*/);
    
    // Verify RNA library tab is visible
    await expect(page.getByTestId('RNA-bases-tab')).toBeVisible();
  });

  test('Case 12 - Verify that switching polymer type in one browser tab and opening a new tab reflects the cached value in the new tab', async () => {
    /*
     * Test task: https://github.com/epam/ketcher/issues/8
     * Description: Verify that switching polymer type in one browser tab and opening a new tab reflects the cached value in the new tab
     * Scenario:
     * 1. Switch to DNA in current tab
     * 2. Open a new tab with Ketcher
     * 3. Verify DNA is selected in new tab
     *
     * Version 3.14.0
     */
    
    // Clear localStorage first to start fresh
    await clearLocalStorage(page);
    await pageReload(page);
    
    // Switch to DNA in current tab
    await MacromoleculesTopToolbar(page).dna();
    
    // Open a new tab (simulate by reloading as multi-tab testing is complex)
    const context = page.context();
    const newPage = await context.newPage();
    await newPage.goto(page.url());
    
    // Wait for new page to load
    await newPage.waitForLoadState('domcontentloaded');
    await newPage.waitForTimeout(2000);
    
    // Switch to macro mode in new tab
    await CommonTopRightToolbar(newPage).turnOnMacromoleculesEditor();
    
    // Verify DNA button is active in new tab
    const dnaButton = MacromoleculesTopToolbar(newPage).dnaButton;
    await expect(dnaButton).toHaveAttribute('data-testid', 'DNABtn');
    await expect(dnaButton).toHaveClass(/.*active.*/);
    
    // Close new tab
    await newPage.close();
  });

  test('Case 13 - Switch polymer type multiple times in sequence (RNA → DNA → PEP → DNA), reload, and verify only the last selected type (DNA) is restored', async () => {
    /*
     * Test task: https://github.com/epam/ketcher/issues/8
     * Description: Switch polymer type multiple times in sequence, reload, and verify only the last selected type is restored
     * Scenario:
     * 1. Switch polymer types: RNA → DNA → PEP → DNA
     * 2. Reload the page
     * 3. Verify only the last selected type (DNA) is restored
     *
     * Version 3.14.0
     */
    
    // Clear localStorage first to start fresh
    await clearLocalStorage(page);
    await pageReload(page);
    
    // Switch polymer types in sequence: RNA → DNA → PEP → DNA
    await MacromoleculesTopToolbar(page).rna();
    await page.waitForTimeout(200);
    
    await MacromoleculesTopToolbar(page).dna();
    await page.waitForTimeout(200);
    
    await MacromoleculesTopToolbar(page).peptides();
    await page.waitForTimeout(200);
    
    await MacromoleculesTopToolbar(page).dna();
    await page.waitForTimeout(200);
    
    // Reload the page
    await pageReload(page);
    
    // Verify only DNA (the last selected) is active after reload
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    await expect(dnaButton).toHaveAttribute('data-testid', 'DNABtn');
    await expect(dnaButton).toHaveClass(/.*active.*/);
    
    // Verify DNA library tab is visible
    await expect(page.getByTestId('DNA-bases-tab')).toBeVisible();
  });

  test('Case 14 - Verify that the cached polymer type persists after navigating away from macromolecule mode to small molecule mode and back', async () => {
    /*
     * Test task: https://github.com/epam/ketcher/issues/8
     * Description: Verify that the cached polymer type persists after navigating away from macromolecule mode to small molecule mode and back
     * Scenario:
     * 1. Switch to PEP in macromolecule mode
     * 2. Switch to small molecule mode
     * 3. Switch back to macromolecule mode
     * 4. Verify PEP is still selected
     *
     * Version 3.14.0
     */
    
    // Clear localStorage first to start fresh
    await clearLocalStorage(page);
    await pageReload(page);
    
    // Switch to Peptides in macromolecule mode
    await MacromoleculesTopToolbar(page).peptides();
    
    // Switch to small molecule mode
    await CommonTopRightToolbar(page).turnOnMicromoleculesEditor();
    
    // Wait a bit
    await page.waitForTimeout(500);
    
    // Switch back to macromolecule mode
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify Peptides button is still active
    const peptidesButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(peptidesButton).toHaveAttribute('data-testid', 'PEPTIDEBtn');
    await expect(peptidesButton).toHaveClass(/.*active.*/);
    
    // Verify Peptides library tab is visible
    await expect(page.getByTestId('A')).toBeVisible(); // Alanine is first in peptide library
  });

  test('Case 15 - Verify that an invalid or corrupted cache value for polymer type falls back gracefully to the RNA default', async () => {
    /*
     * Test task: https://github.com/epam/ketcher/issues/8
     * Description: Verify that an invalid or corrupted cache value for polymer type falls back gracefully to the RNA default
     * Scenario:
     * 1. Set invalid cache value in localStorage
     * 2. Switch to macro mode
     * 3. Verify fallback to RNA default
     *
     * Version 3.14.0
     */
    
    // Clear localStorage and set invalid polymer type cache
    await clearLocalStorage(page);
    await page.evaluate(() => {
      localStorage.setItem('ketcher-polymer-type', 'INVALID_TYPE');
    });
    
    // Switch to micro mode first
    await CommonTopRightToolbar(page).turnOnMicromoleculesEditor();
    
    // Switch to macro mode
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify RNA button is active as fallback
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-testid', 'RNABtn');
    await expect(rnaButton).toHaveClass(/.*active.*/);
    
    // Verify RNA library tab is visible
    await expect(page.getByTestId('RNA-bases-tab')).toBeVisible();
    
    // Verify the invalid cache has been corrected
    const correctedCacheValue = await page.evaluate(() => {
      return localStorage.getItem('ketcher-polymer-type');
    });
    expect(correctedCacheValue).toBe('RNA');
  });
});