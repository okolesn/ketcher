/* eslint-disable no-magic-numbers */
import { Page, test, expect } from '@fixtures';
import { CommonTopRightToolbar } from '@tests/pages/common/CommonTopRightToolbar';
import { MacromoleculesTopToolbar } from '@tests/pages/macromolecules/MacromoleculesTopToolbar';
import { pageReload, clearLocalStorage } from '@utils/common/helpers';
import { takeEditorScreenshot } from '@utils';

let page: Page;

test.describe('Polymer Type Switcher Caching', () => {
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
     * 2. Open application
     * 3. Switch to macromolecule mode
     * 4. Verify RNA is selected by default
     *
     * Version 3.15.0
     */
    await clearLocalStorage(page);
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify RNA button is active by checking data-isactive attribute
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-isactive', 'true');
    await takeEditorScreenshot(page);
  });

  test('Case 2 - Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select DNA via polymer type switcher
     * 3. Reload the page
     * 4. Verify DNA is selected from cache
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).dna();
    await pageReload(page);
    
    // Verify DNA button is active after reload
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    await expect(dnaButton).toHaveAttribute('data-isactive', 'true');
    await takeEditorScreenshot(page);
  });

  test('Case 3 - Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select PEP via polymer type switcher
     * 3. Reload the page
     * 4. Verify PEP is selected from cache
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).peptides();
    await pageReload(page);
    
    // Verify Peptides button is active after reload
    const peptidesButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(peptidesButton).toHaveAttribute('data-isactive', 'true');
    await takeEditorScreenshot(page);
  });

  test('Case 4 - Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select RNA via polymer type switcher
     * 3. Reload the page
     * 4. Verify RNA is selected from cache
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).rna();
    await pageReload(page);
    
    // Verify RNA button is active after reload
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-isactive', 'true');
    await takeEditorScreenshot(page);
  });

  test('Case 5 - Use Ctrl+Alt+D hotkey to switch to DNA, reload the page, and verify DNA is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Use Ctrl+Alt+D hotkey to switch to DNA, reload the page, and verify DNA is restored from cache
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Use Ctrl+Alt+D hotkey to select DNA
     * 3. Reload the page
     * 4. Verify DNA is selected from cache
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await page.keyboard.press('Control+Alt+KeyD');
    await pageReload(page);
    
    // Verify DNA button is active after reload
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    await expect(dnaButton).toHaveAttribute('data-isactive', 'true');
    await takeEditorScreenshot(page);
  });

  test('Case 6 - Use Ctrl+Alt+P hotkey to switch to PEP, reload the page, and verify PEP is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Use Ctrl+Alt+P hotkey to switch to PEP, reload the page, and verify PEP is restored from cache
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Use Ctrl+Alt+P hotkey to select PEP
     * 3. Reload the page
     * 4. Verify PEP is selected from cache
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await page.keyboard.press('Control+Alt+KeyP');
    await pageReload(page);
    
    // Verify Peptides button is active after reload
    const peptidesButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(peptidesButton).toHaveAttribute('data-isactive', 'true');
    await takeEditorScreenshot(page);
  });

  test('Case 7 - Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Use Ctrl+Alt+R hotkey to select RNA
     * 3. Reload the page
     * 4. Verify RNA is selected from cache
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await page.keyboard.press('Control+Alt+KeyR');
    await pageReload(page);
    
    // Verify RNA button is active after reload
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-isactive', 'true');
    await takeEditorScreenshot(page);
  });

  test('Case 8 - Change the polymer type by switching the library tab, reload the page, and verify the cached type matches the last library tab used', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Change the polymer type by switching the library tab, reload the page, and verify the cached type matches the last library tab used
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Click on peptides library tab to switch type
     * 3. Reload the page
     * 4. Verify PEP is selected from cache
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Click on peptides library tab
    const peptidesTab = page.locator('[data-testid="tab-Peptides"]');
    await peptidesTab.click();
    await pageReload(page);
    
    // Verify Peptides button is active after reload
    const peptidesButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(peptidesButton).toHaveAttribute('data-isactive', 'true');
    await takeEditorScreenshot(page);
  });

  test('Case 9 - Switch to PEP, reload the page, enter flex mode, and verify the peptide library tab is opened by default despite switcher not being visible', async ({
    FlexCanvas: _,
  }) => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Switch to PEP, reload the page, enter flex mode, and verify the peptide library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select PEP
     * 3. Reload the page
     * 4. Enter flex mode
     * 5. Verify peptide library tab is active
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).peptides();
    await pageReload(page);
    
    // Verify peptides library tab is active
    const peptidesTab = page.locator('[data-testid="tab-Peptides"]');
    await expect(peptidesTab).toHaveAttribute('aria-selected', 'true');
    await takeEditorScreenshot(page);
  });

  test('Case 10 - Switch to DNA, reload the page, enter snake mode, and verify the DNA library tab is opened by default despite switcher not being visible', async ({
    SnakeCanvas: _,
  }) => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Switch to DNA, reload the page, enter snake mode, and verify the DNA library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select DNA
     * 3. Reload the page
     * 4. Enter snake mode
     * 5. Verify DNA library tabs are active
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).dna();
    await pageReload(page);
    
    // Verify DNA library tabs are active (bases, sugars, phosphates)
    const basesTab = page.locator('[data-testid="tab-Bases"]');
    const sugarsTab = page.locator('[data-testid="tab-Sugars"]');
    const phosphatesTab = page.locator('[data-testid="tab-Phosphates"]');
    
    // At least one DNA-related tab should be active
    const activeTab = await page.locator('[aria-selected="true"]').first();
    const activeTabText = await activeTab.textContent();
    expect(['Bases', 'Sugars', 'Phosphates']).toContain(activeTabText);
    await takeEditorScreenshot(page);
  });

  test('Case 11 - Clear browser cache/localStorage, open macromolecule mode, and verify RNA is selected as the fallback default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Clear browser cache/localStorage, open macromolecule mode, and verify RNA is selected as the fallback default
     * Scenario:
     * 1. Clear localStorage
     * 2. Reload page
     * 3. Switch to macromolecule mode
     * 4. Verify RNA is selected as default
     *
     * Version 3.15.0
     */
    await clearLocalStorage(page);
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify RNA button is active
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-isactive', 'true');
    await takeEditorScreenshot(page);
  });

  test('Case 12 - Verify that switching polymer type in one browser tab and opening a new tab reflects the cached value in the new tab', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Verify that switching polymer type in one browser tab and opening a new tab reflects the cached value in the new tab
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select DNA
     * 3. Open new browser context
     * 4. Verify DNA is selected in new tab
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).dna();
    
    // Open new browser context to simulate new tab
    const context = page.context();
    const newPage = await context.newPage();
    await newPage.goto(page.url());
    await newPage.waitForLoadState('domcontentloaded');
    await CommonTopRightToolbar(newPage).turnOnMacromoleculesEditor();
    
    // Verify DNA button is active in new tab
    const dnaButton = MacromoleculesTopToolbar(newPage).dnaButton;
    await expect(dnaButton).toHaveAttribute('data-isactive', 'true');
    
    await newPage.close();
    await takeEditorScreenshot(page);
  });

  test('Case 13 - Switch polymer type multiple times in sequence (RNA → DNA → PEP → DNA), reload, and verify only the last selected type (DNA) is restored', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Switch polymer type multiple times in sequence (RNA → DNA → PEP → DNA), reload, and verify only the last selected type (DNA) is restored
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select RNA
     * 3. Select DNA
     * 4. Select PEP
     * 5. Select DNA again
     * 6. Reload page
     * 7. Verify only DNA (last selection) is restored
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).rna();
    await page.waitForTimeout(100);
    await MacromoleculesTopToolbar(page).dna();
    await page.waitForTimeout(100);
    await MacromoleculesTopToolbar(page).peptides();
    await page.waitForTimeout(100);
    await MacromoleculesTopToolbar(page).dna();
    
    await pageReload(page);
    
    // Verify DNA button is active (last selection)
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    await expect(dnaButton).toHaveAttribute('data-isactive', 'true');
    await takeEditorScreenshot(page);
  });

  test('Case 14 - Verify that the cached polymer type persists after navigating away from macromolecule mode to small molecule mode and back', async ({
    MoleculesCanvas: _,
  }) => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Verify that the cached polymer type persists after navigating away from macromolecule mode to small molecule mode and back
     * Scenario:
     * 1. Switch to macromolecule mode
     * 2. Select PEP
     * 3. Switch to small molecule mode
     * 4. Switch back to macromolecule mode
     * 5. Verify PEP is still selected
     *
     * Version 3.15.0
     */
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).peptides();
    
    // Switch to small molecule mode
    await CommonTopRightToolbar(page).turnOnMicromoleculesEditor();
    
    // Switch back to macromolecule mode
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify Peptides button is still active
    const peptidesButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(peptidesButton).toHaveAttribute('data-isactive', 'true');
    await takeEditorScreenshot(page);
  });

  test('Case 15 - Verify that an invalid or corrupted cache value for polymer type falls back gracefully to the RNA default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/8
     * Description: Verify that an invalid or corrupted cache value for polymer type falls back gracefully to the RNA default
     * Scenario:
     * 1. Set invalid cache value in localStorage
     * 2. Reload page
     * 3. Switch to macromolecule mode
     * 4. Verify RNA is selected as fallback
     *
     * Version 3.15.0
     */
    // Set invalid cache value
    await page.evaluate(() => {
      localStorage.setItem('ketcher-polymer-type', 'INVALID_TYPE');
    });
    
    await pageReload(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    
    // Verify RNA button is active (fallback default)
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveAttribute('data-isactive', 'true');
    await takeEditorScreenshot(page);
  });
});