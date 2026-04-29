/* eslint-disable no-magic-numbers */
import { Page, test, expect } from '@fixtures';
import { MacromoleculesTopToolbar } from '@tests/pages/macromolecules/MacromoleculesTopToolbar';
import { LayoutMode } from '@tests/pages/constants/macromoleculesTopToolbar/Constants';
import { clearLocalStorage } from '@utils/common/helpers';
import { waitForKetcherInit } from '@utils/common/loaders/waitForKetcherInit/waitForKetcherInit';
import { CommonTopRightToolbar } from '@tests/pages/common/CommonTopRightToolbar';

let page: Page;

/**
 * Helper function to reload page and navigate to sequence mode
 */
async function reloadAndGoToSequenceMode(targetPage: Page) {
  await targetPage.reload();
  await targetPage.goto('', { waitUntil: 'domcontentloaded' });
  await waitForKetcherInit(targetPage);
  await CommonTopRightToolbar(targetPage).turnOnMacromoleculesEditor();
  await MacromoleculesTopToolbar(targetPage).selectLayoutModeTool(LayoutMode.Sequence);
}

/**
 * Helper function to reload page and navigate to flex mode
 */
async function reloadAndGoToFlexMode(targetPage: Page) {
  await targetPage.reload();
  await targetPage.goto('', { waitUntil: 'domcontentloaded' });
  await waitForKetcherInit(targetPage);
  await CommonTopRightToolbar(targetPage).turnOnMacromoleculesEditor();
  await MacromoleculesTopToolbar(targetPage).selectLayoutModeTool(LayoutMode.Flex);
}

/**
 * Helper function to reload page and navigate to snake mode
 */
async function reloadAndGoToSnakeMode(targetPage: Page) {
  await targetPage.reload();
  await targetPage.goto('', { waitUntil: 'domcontentloaded' });
  await waitForKetcherInit(targetPage);
  await CommonTopRightToolbar(targetPage).turnOnMacromoleculesEditor();
  await MacromoleculesTopToolbar(targetPage).selectLayoutModeTool(LayoutMode.Snake);
}

/**
 * Helper function to check which polymer type button is active
 */
async function getActivePolymerType(targetPage: Page): Promise<string> {
  const rnaButton = MacromoleculesTopToolbar(targetPage).rnaButton;
  const dnaButton = MacromoleculesTopToolbar(targetPage).dnaButton;
  const peptidesButton = MacromoleculesTopToolbar(targetPage).peptidesButton;

  const rnaActive = await rnaButton.getAttribute('class');
  const dnaActive = await dnaButton.getAttribute('class');
  const peptidesActive = await peptidesButton.getAttribute('class');

  if (rnaActive?.includes('MuiButton-contained')) return 'RNA';
  if (dnaActive?.includes('MuiButton-contained')) return 'DNA';
  if (peptidesActive?.includes('MuiButton-contained')) return 'PEP';

  return 'None';
}

test.describe('Autotests: Save polymer type switcher (RNA/DNA/PEP) to browser cache', () => {
  test.beforeAll(async ({ initSequenceCanvas }) => {
    page = await initSequenceCanvas();
  });

  test.afterAll(async ({ closePage }) => {
    await closePage();
  });

  test('Case 1 - When no cached value exists, verify that switching to macromolecule mode defaults to RNA polymer type', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: When no cached value exists, verify that switching to macromolecule mode defaults to RNA polymer type
     * Scenario:
     * 1. Clear local storage to remove any cached polymer type
     * 2. Reload page and switch to macromolecule sequence mode
     * 3. Verify RNA is the default selected polymer type
     *
     * Version 3.12.0
     */
    await clearLocalStorage(page);
    await reloadAndGoToSequenceMode(page);
    
    const activeType = await getActivePolymerType(page);
    expect(activeType).toBe('RNA');
  });

  test('Case 2 - Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected
     * Scenario:
     * 1. Click DNA button in polymer type switcher
     * 2. Reload page and switch to macromolecule sequence mode
     * 3. Verify DNA is selected from cache
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).dna();
    await reloadAndGoToSequenceMode(page);
    
    const activeType = await getActivePolymerType(page);
    expect(activeType).toBe('DNA');
  });

  test('Case 3 - Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected
     * Scenario:
     * 1. Click PEP button in polymer type switcher
     * 2. Reload page and switch to macromolecule sequence mode
     * 3. Verify PEP is selected from cache
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).peptides();
    await reloadAndGoToSequenceMode(page);
    
    const activeType = await getActivePolymerType(page);
    expect(activeType).toBe('PEP');
  });

  test('Case 4 - Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected
     * Scenario:
     * 1. Click RNA button in polymer type switcher
     * 2. Reload page and switch to macromolecule sequence mode
     * 3. Verify RNA is selected from cache
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).rna();
    await reloadAndGoToSequenceMode(page);
    
    const activeType = await getActivePolymerType(page);
    expect(activeType).toBe('RNA');
  });

  test('Case 5 - Use Ctrl+Alt+D hotkey to switch to DNA, reload the page, and verify DNA is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Use Ctrl+Alt+D hotkey to switch to DNA, reload the page, and verify DNA is restored from cache
     * Scenario:
     * 1. Press Ctrl+Alt+D hotkey to switch to DNA
     * 2. Reload page and switch to macromolecule sequence mode
     * 3. Verify DNA is selected from cache
     *
     * Version 3.12.0
     */
    await page.keyboard.press('Control+Alt+KeyD');
    await reloadAndGoToSequenceMode(page);
    
    const activeType = await getActivePolymerType(page);
    expect(activeType).toBe('DNA');
  });

  test('Case 6 - Use Ctrl+Alt+P hotkey to switch to PEP, reload the page, and verify PEP is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Use Ctrl+Alt+P hotkey to switch to PEP, reload the page, and verify PEP is restored from cache
     * Scenario:
     * 1. Press Ctrl+Alt+P hotkey to switch to PEP
     * 2. Reload page and switch to macromolecule sequence mode
     * 3. Verify PEP is selected from cache
     *
     * Version 3.12.0
     */
    await page.keyboard.press('Control+Alt+KeyP');
    await reloadAndGoToSequenceMode(page);
    
    const activeType = await getActivePolymerType(page);
    expect(activeType).toBe('PEP');
  });

  test('Case 7 - Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache
     * Scenario:
     * 1. Press Ctrl+Alt+R hotkey to switch to RNA
     * 2. Reload page and switch to macromolecule sequence mode
     * 3. Verify RNA is selected from cache
     *
     * Version 3.12.0
     */
    await page.keyboard.press('Control+Alt+KeyR');
    await reloadAndGoToSequenceMode(page);
    
    const activeType = await getActivePolymerType(page);
    expect(activeType).toBe('RNA');
  });

  test('Case 8 - Change the polymer type by switching the library tab, reload the page, and verify the cached type matches the last library tab used', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Change the polymer type by switching the library tab, reload the page, and verify the cached type matches the last library tab used
     * Scenario:
     * 1. Switch to peptides library tab (which should change polymer type to PEP)
     * 2. Reload page and switch to macromolecule sequence mode
     * 3. Verify PEP is selected from cache
     *
     * Version 3.12.0
     */
    // Switch to peptides library tab via the button (this should change polymer type)
    await page.getByText('Peptides').click();
    await reloadAndGoToSequenceMode(page);
    
    const activeType = await getActivePolymerType(page);
    expect(activeType).toBe('PEP');
  });

  test('Case 9 - Switch to PEP, reload the page, enter flex mode, and verify the peptide library tab is opened by default despite switcher not being visible', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Switch to PEP, reload the page, enter flex mode, and verify the peptide library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Switch to PEP polymer type
     * 2. Reload page and switch to macromolecule flex mode
     * 3. Verify that the peptides library tab is active
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).peptides();
    await reloadAndGoToFlexMode(page);
    
    const activeTab = page.getByText('Peptides').first();
    await expect(activeTab).toHaveAttribute('aria-selected', 'true');
  });

  test('Case 10 - Switch to DNA, reload the page, enter snake mode, and verify the RNA library tab is opened by default despite switcher not being visible', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Switch to DNA, reload the page, enter snake mode, and verify the RNA library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Switch to DNA polymer type
     * 2. Reload page and switch to macromolecule snake mode
     * 3. Verify that the RNA library tab is active (DNA uses RNA tab)
     *
     * Version 3.12.0
     */
    await reloadAndGoToSequenceMode(page);
    await MacromoleculesTopToolbar(page).dna();
    await reloadAndGoToSnakeMode(page);
    
    const activeTab = page.getByText('RNA').first();
    await expect(activeTab).toHaveAttribute('aria-selected', 'true');
  });

  test('Case 11 - Clear browser cache/localStorage, open macromolecule mode, and verify RNA is selected as the fallback default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Clear browser cache/localStorage, open macromolecule mode, and verify RNA is selected as the fallback default
     * Scenario:
     * 1. Clear localStorage to remove cached polymer type
     * 2. Reload page and switch to macromolecule sequence mode
     * 3. Verify RNA is selected as fallback default
     *
     * Version 3.12.0
     */
    await clearLocalStorage(page);
    await reloadAndGoToSequenceMode(page);
    
    const activeType = await getActivePolymerType(page);
    expect(activeType).toBe('RNA');
  });

  test('Case 12 - Verify that switching polymer type in one browser tab and opening a new tab reflects the cached value in the new tab', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Verify that switching polymer type in one browser tab and opening a new tab reflects the cached value in the new tab
     * Scenario:
     * 1. Switch to DNA polymer type in current tab
     * 2. Open new tab with Ketcher
     * 3. Switch to macromolecule sequence mode in new tab
     * 4. Verify DNA is selected from cache in new tab
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).dna();
    
    // Open new tab
    const newPage = await page.context().newPage();
    await newPage.goto(page.url());
    await waitForKetcherInit(newPage);
    await CommonTopRightToolbar(newPage).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(newPage).selectLayoutModeTool(LayoutMode.Sequence);
    
    const activeType = await getActivePolymerType(newPage);
    expect(activeType).toBe('DNA');
    
    await newPage.close();
  });

  test('Case 13 - Switch polymer type multiple times in sequence (RNA → DNA → PEP → DNA), reload, and verify only the last selected type (DNA) is restored', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Switch polymer type multiple times in sequence, reload, and verify only the last selected type is restored
     * Scenario:
     * 1. Switch polymer types in sequence: RNA → DNA → PEP → DNA
     * 2. Reload page and switch to macromolecule sequence mode
     * 3. Verify only the last selected type (DNA) is restored
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).rna();
    await MacromoleculesTopToolbar(page).dna();
    await MacromoleculesTopToolbar(page).peptides();
    await MacromoleculesTopToolbar(page).dna();
    
    await reloadAndGoToSequenceMode(page);
    
    const activeType = await getActivePolymerType(page);
    expect(activeType).toBe('DNA');
  });

  test('Case 14 - Verify that the cached polymer type persists after navigating away from macromolecule mode to small molecule mode and back', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Verify that the cached polymer type persists after navigating away from macromolecule mode to small molecule mode and back
     * Scenario:
     * 1. Switch to PEP polymer type
     * 2. Switch to micromolecule mode
     * 3. Switch back to macromolecule sequence mode
     * 4. Verify PEP is still selected
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).peptides();
    await CommonTopRightToolbar(page).turnOnMicromoleculesEditor();
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Sequence);
    
    const activeType = await getActivePolymerType(page);
    expect(activeType).toBe('PEP');
  });

  test('Case 15 - Verify that an invalid or corrupted cache value for polymer type falls back gracefully to the RNA default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Verify that an invalid or corrupted cache value for polymer type falls back gracefully to the RNA default
     * Scenario:
     * 1. Set an invalid cache value in localStorage
     * 2. Reload page and switch to macromolecule sequence mode
     * 3. Verify RNA is selected as fallback default
     *
     * Version 3.12.0
     */
    await page.evaluate(() => {
      localStorage.setItem('polymerType', 'INVALID_TYPE');
    });
    
    await reloadAndGoToSequenceMode(page);
    
    const activeType = await getActivePolymerType(page);
    expect(activeType).toBe('RNA');
  });
});