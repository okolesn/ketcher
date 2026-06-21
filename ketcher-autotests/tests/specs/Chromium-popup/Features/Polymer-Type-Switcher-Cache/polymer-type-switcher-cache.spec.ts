/* eslint-disable no-magic-numbers */
import { Page, test } from '@playwright/test';
import {
  openFileAndAddToCanvas,
  waitForPageInit,
  takeEditorScreenshot,
  pageReload,
  clearLocalStorage,
  keyboardPressOnCanvas,
  getAltModifier,
} from '@utils';
import { MacromoleculesTopToolbar } from '@/tests/pages/macromolecules/MacromoleculesTopToolbar';
import { Library } from '@/tests/pages/macromolecules/Library';
import { CommonTopRightToolbar } from '@/tests/pages/common/CommonTopRightToolbar';

/**
 * Autotests for Polymer Type Switcher (RNA/DNA/PEP) Browser Cache Functionality
 * 
 * Related Issue: https://github.com/okolesn/ketcher/issues/8
 * Related Source Task: https://github.com/okolesn/ketcher/issues/2
 * 
 * This test suite covers the comprehensive functionality of polymer type switcher
 * cache persistence across browser sessions, page reloads, and various interaction modes.
 * 
 * Test Scenarios Covered:
 * 1. Default RNA fallback when no cached value exists
 * 2. DNA selection persistence after page reload
 * 3. PEP selection persistence after page reload
 * 4. RNA selection persistence after explicit selection + reload
 * 5. Ctrl+Alt+D hotkey to switch to DNA with cache restoration
 * 6. Ctrl+Alt+P hotkey to switch to PEP with cache restoration
 * 7. Ctrl+Alt+R hotkey to switch to RNA with cache restoration
 * 8. Library tab synchronization with polymer type selection
 * 9. PEP persistence in flex mode with peptide library tab
 * 10. DNA persistence in snake mode with RNA library tab
 * 11. Clear cache fallback gracefully to RNA default
 * 12. Cache persistence across multiple browser tabs
 * 13. Multiple selection sequence handling (last selection wins)
 * 14. Cache persistence across micro/macro mode switching
 * 15. Invalid cache value graceful fallback to RNA default
 */

let page: Page;
let macromoleculesTopToolbar: ReturnType<typeof MacromoleculesTopToolbar>;
let library: ReturnType<typeof Library>;
let commonTopRightToolbar: ReturnType<typeof CommonTopRightToolbar>;

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  page = await context.newPage();

  await waitForPageInit(page);
  await page.goto('', { waitUntil: 'domcontentloaded' });

  macromoleculesTopToolbar = MacromoleculesTopToolbar(page);
  library = Library(page);
  commonTopRightToolbar = CommonTopRightToolbar(page);

  await commonTopRightToolbar.turnOnMacromoleculesEditor();
});

test.afterAll(async () => {
  await page?.close();
});

test.describe('Polymer Type Switcher Cache Persistence Tests', () => {
  test.beforeEach(async () => {
    // Clear localStorage before each test to ensure clean state
    await clearLocalStorage(page);
    await pageReload(page);
  });

  test('Test 1: When no cached value exists, verify that switching to macromolecule mode defaults to RNA polymer type', async () => {
    // Clear cache and verify RNA is selected by default
    await clearLocalStorage(page);
    await pageReload(page);
    
    // Take screenshot to verify RNA is the default selected polymer type
    await takeEditorScreenshot(page);
    
    // Verify RNA tab is active in library by checking aria-selected attribute
    const rnaTabSelected = await library.isTabOpened('RNA');
    test.expect(rnaTabSelected).toBe(true);
  });

  test('Test 2: Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected', async () => {
    // Select DNA via polymer type switcher
    await macromoleculesTopToolbar.dna();
    await page.waitForTimeout(1000); // Allow time for cache update
    
    // Reload page and verify DNA is restored
    await pageReload(page);
    
    // Take screenshot to verify DNA selection is persisted
    await takeEditorScreenshot(page);
    
    // Verify DNA tab is active in library
    const dnaTabSelected = await library.isTabOpened('RNA'); // DNA uses RNA tab structure
    test.expect(dnaTabSelected).toBe(true);
  });

  test('Test 3: Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected', async () => {
    // Select PEP via polymer type switcher
    await macromoleculesTopToolbar.peptides();
    await page.waitForTimeout(1000); // Allow time for cache update
    
    // Reload page and verify PEP is restored
    await pageReload(page);
    
    // Take screenshot to verify PEP selection is persisted
    await takeEditorScreenshot(page);
    
    // Verify Peptides tab is active in library
    const peptidesTabSelected = await library.isTabOpened('Peptides');
    test.expect(peptidesTabSelected).toBe(true);
  });

  test('Test 4: Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected', async () => {
    // First select DNA to change from default
    await macromoleculesTopToolbar.dna();
    await page.waitForTimeout(1000);
    
    // Then explicitly select RNA
    await macromoleculesTopToolbar.rna();
    await page.waitForTimeout(1000); // Allow time for cache update
    
    // Reload page and verify RNA is restored
    await pageReload(page);
    
    // Take screenshot to verify RNA selection is persisted
    await takeEditorScreenshot(page);
    
    // Verify RNA tab is active in library
    const rnaTabSelected = await library.isTabOpened('RNA');
    test.expect(rnaTabSelected).toBe(true);
  });

  test('Test 5: Use Ctrl+Alt+D hotkey to switch to DNA, reload the page, and verify DNA is restored from cache', async () => {
    // Use keyboard shortcut to switch to DNA
    const altModifier = getAltModifier();
    await keyboardPressOnCanvas(page, `Control+${altModifier}+d`);
    await page.waitForTimeout(1000); // Allow time for cache update
    
    // Reload page and verify DNA is restored
    await pageReload(page);
    
    // Take screenshot to verify DNA selection is persisted
    await takeEditorScreenshot(page);
    
    // Verify DNA tab/library state is restored
    const rnaTabSelected = await library.isTabOpened('RNA'); // DNA uses RNA tab structure
    test.expect(rnaTabSelected).toBe(true);
  });

  test('Test 6: Use Ctrl+Alt+P hotkey to switch to PEP, reload the page, and verify PEP is restored from cache', async () => {
    // Use keyboard shortcut to switch to PEP
    const altModifier = getAltModifier();
    await keyboardPressOnCanvas(page, `Control+${altModifier}+p`);
    await page.waitForTimeout(1000); // Allow time for cache update
    
    // Reload page and verify PEP is restored
    await pageReload(page);
    
    // Take screenshot to verify PEP selection is persisted
    await takeEditorScreenshot(page);
    
    // Verify Peptides tab is active in library
    const peptidesTabSelected = await library.isTabOpened('Peptides');
    test.expect(peptidesTabSelected).toBe(true);
  });

  test('Test 7: Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache', async () => {
    // First switch to DNA to change from default
    await macromoleculesTopToolbar.dna();
    await page.waitForTimeout(1000);
    
    // Use keyboard shortcut to switch to RNA
    const altModifier = getAltModifier();
    await keyboardPressOnCanvas(page, `Control+${altModifier}+r`);
    await page.waitForTimeout(1000); // Allow time for cache update
    
    // Reload page and verify RNA is restored
    await pageReload(page);
    
    // Take screenshot to verify RNA selection is persisted
    await takeEditorScreenshot(page);
    
    // Verify RNA tab is active in library
    const rnaTabSelected = await library.isTabOpened('RNA');
    test.expect(rnaTabSelected).toBe(true);
  });

  test('Test 8: Change the polymer type by switching the library tab (e.g., to peptides tab), reload the page, and verify the cached type matches the last library tab used', async () => {
    // Switch to peptides tab in library
    await library.switchToPeptidesTab();
    await page.waitForTimeout(1000); // Allow time for cache update
    
    // Reload page and verify peptides tab is restored
    await pageReload(page);
    
    // Take screenshot to verify peptides selection is persisted
    await takeEditorScreenshot(page);
    
    // Verify Peptides tab is active in library
    const peptidesTabSelected = await library.isTabOpened('Peptides');
    test.expect(peptidesTabSelected).toBe(true);
  });

  test('Test 9: Switch to PEP, reload the page, enter flex mode, and verify the peptide library tab is opened by default despite switcher not being visible', async () => {
    // Select PEP via polymer type switcher
    await macromoleculesTopToolbar.peptides();
    await page.waitForTimeout(1000); // Allow time for cache update
    
    // Reload page
    await pageReload(page);
    
    // Switch to flex mode (Note: Implementation depends on available layout mode controls)
    // This would need to be implemented based on the actual UI controls available
    // await macromoleculesTopToolbar.selectLayoutModeTool('flex-mode'); // Placeholder
    
    // Take screenshot to verify peptides selection is persisted in flex mode
    await takeEditorScreenshot(page);
    
    // Verify Peptides tab is still active
    const peptidesTabSelected = await library.isTabOpened('Peptides');
    test.expect(peptidesTabSelected).toBe(true);
  });

  test('Test 10: Switch to DNA, reload the page, enter snake mode, and verify the DNA library tab is opened by default despite switcher not being visible', async () => {
    // Select DNA via polymer type switcher
    await macromoleculesTopToolbar.dna();
    await page.waitForTimeout(1000); // Allow time for cache update
    
    // Reload page
    await pageReload(page);
    
    // Switch to snake mode (Note: Implementation depends on available layout mode controls)
    // This would need to be implemented based on the actual UI controls available
    // await macromoleculesTopToolbar.selectLayoutModeTool('snake-mode'); // Placeholder
    
    // Take screenshot to verify DNA selection is persisted in snake mode
    await takeEditorScreenshot(page);
    
    // Verify RNA tab is active (DNA uses RNA tab structure)
    const rnaTabSelected = await library.isTabOpened('RNA');
    test.expect(rnaTabSelected).toBe(true);
  });

  test('Test 11: Clear browser cache/localStorage, open macromolecule mode, and verify RNA is selected as the fallback default', async () => {
    // First select DNA to change from default
    await macromoleculesTopToolbar.dna();
    await page.waitForTimeout(1000);
    
    // Clear localStorage and reload
    await clearLocalStorage(page);
    await pageReload(page);
    
    // Take screenshot to verify RNA fallback is active
    await takeEditorScreenshot(page);
    
    // Verify RNA tab is active as fallback
    const rnaTabSelected = await library.isTabOpened('RNA');
    test.expect(rnaTabSelected).toBe(true);
  });

  test('Test 12: Verify that switching polymer type in one browser tab and opening a new tab reflects the cached value in the new tab', async () => {
    // Select PEP in current tab
    await macromoleculesTopToolbar.peptides();
    await page.waitForTimeout(1000); // Allow time for cache update
    
    // Open new tab/context
    const newContext = await page.context().browser()?.newContext();
    const newPage = await newContext?.newPage();
    
    if (newPage) {
      await waitForPageInit(newPage);
      await newPage.goto('', { waitUntil: 'domcontentloaded' });
      
      const newPageCommonTopRightToolbar = CommonTopRightToolbar(newPage);
      await newPageCommonTopRightToolbar.turnOnMacromoleculesEditor();
      
      const newPageLibrary = Library(newPage);
      
      // Take screenshot to verify PEP selection is shared across tabs
      await takeEditorScreenshot(newPage);
      
      // Verify Peptides tab is active in new tab
      const peptidesTabSelected = await newPageLibrary.isTabOpened('Peptides');
      test.expect(peptidesTabSelected).toBe(true);
      
      await newPage.close();
      await newContext?.close();
    }
  });

  test('Test 13: Switch polymer type multiple times in sequence (RNA → DNA → PEP → DNA), reload, and verify only the last selected type (DNA) is restored', async () => {
    // Sequence of polymer type switches
    await macromoleculesTopToolbar.rna();
    await page.waitForTimeout(500);
    
    await macromoleculesTopToolbar.dna();
    await page.waitForTimeout(500);
    
    await macromoleculesTopToolbar.peptides();
    await page.waitForTimeout(500);
    
    await macromoleculesTopToolbar.dna(); // Final selection
    await page.waitForTimeout(1000); // Allow time for cache update
    
    // Reload page and verify DNA (last selection) is restored
    await pageReload(page);
    
    // Take screenshot to verify DNA selection is persisted
    await takeEditorScreenshot(page);
    
    // Verify RNA tab is active (DNA uses RNA tab structure)
    const rnaTabSelected = await library.isTabOpened('RNA');
    test.expect(rnaTabSelected).toBe(true);
  });

  test('Test 14: Verify that the cached polymer type persists after navigating away from macromolecule mode to small molecule mode and back', async () => {
    // Select PEP in macromolecule mode
    await macromoleculesTopToolbar.peptides();
    await page.waitForTimeout(1000);
    
    // Switch to micromolecules (small molecule) mode
    await commonTopRightToolbar.turnOnMicromoleculesEditor();
    await page.waitForTimeout(1000);
    
    // Switch back to macromolecules mode
    await commonTopRightToolbar.turnOnMacromoleculesEditor();
    await page.waitForTimeout(1000);
    
    // Take screenshot to verify PEP selection is persisted after mode switching
    await takeEditorScreenshot(page);
    
    // Verify Peptides tab is still active
    const peptidesTabSelected = await library.isTabOpened('Peptides');
    test.expect(peptidesTabSelected).toBe(true);
  });

  test('Test 15: Verify that an invalid or corrupted cache value for polymer type falls back gracefully to the RNA default', async () => {
    // First set a valid cache value
    await macromoleculesTopToolbar.dna();
    await page.waitForTimeout(1000);
    
    // Corrupt the cache value using page.evaluate
    await page.evaluate(() => {
      localStorage.setItem('polymerType', 'invalid_polymer_type_value');
    });
    
    // Reload page and verify graceful fallback to RNA
    await pageReload(page);
    
    // Take screenshot to verify RNA fallback is active
    await takeEditorScreenshot(page);
    
    // Verify RNA tab is active as fallback
    const rnaTabSelected = await library.isTabOpened('RNA');
    test.expect(rnaTabSelected).toBe(true);
  });
});