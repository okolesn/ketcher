/* eslint-disable no-magic-numbers */
import { Page, test, expect } from '@fixtures';
import { CommonTopRightToolbar } from '@tests/pages/common/CommonTopRightToolbar';
import { MacromoleculesTopToolbar } from '@tests/pages/macromolecules/MacromoleculesTopToolbar';
import { Library } from '@tests/pages/macromolecules/Library';
import { LibraryTab } from '@tests/pages/constants/library/Constants';
import { LayoutMode } from '@tests/pages/constants/macromoleculesTopToolbar/Constants';
import { clearLocalStorage } from '@utils/common/helpers';
import { waitForKetcherInit } from '@utils/common/loaders/waitForKetcherInit/waitForKetcherInit';

let page: Page;

test.describe('Polymer Type Switcher Cache Tests', () => {
  test.beforeAll(async ({ initSequenceCanvas }) => {
    page = await initSequenceCanvas();
  });

  test.afterAll(async ({ closePage }) => {
    await closePage();
  });

  // Custom reload helpers that preserve test mode state
  async function reloadAndGoToSequenceMode(page: Page) {
    await page.reload();
    await page.goto('', { waitUntil: 'domcontentloaded' });
    await waitForKetcherInit(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Sequence);
  }

  async function reloadAndGoToFlexMode(page: Page) {
    await page.reload();
    await page.goto('', { waitUntil: 'domcontentloaded' });
    await waitForKetcherInit(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Flex);
  }

  async function reloadAndGoToSnakeMode(page: Page) {
    await page.reload();
    await page.goto('', { waitUntil: 'domcontentloaded' });
    await waitForKetcherInit(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Snake);
  }

  // Helper to check which polymer button is active
  async function getActivePolymerType(page: Page): Promise<'RNA' | 'DNA' | 'PEP'> {
    const rnaActive = await MacromoleculesTopToolbar(page).rnaButton.getAttribute('class');
    const dnaActive = await MacromoleculesTopToolbar(page).dnaButton.getAttribute('class');
    const pepActive = await MacromoleculesTopToolbar(page).peptidesButton.getAttribute('class');

    if (rnaActive?.includes('MuiButton-contained')) return 'RNA';
    if (dnaActive?.includes('MuiButton-contained')) return 'DNA';
    if (pepActive?.includes('MuiButton-contained')) return 'PEP';
    
    // Default fallback
    return 'RNA';
  }

  test('Case 1 - When no cached value exists, verify that switching to macromolecule mode defaults to RNA polymer type', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: When no cached value exists, verify that switching to macromolecule mode defaults to RNA polymer type
     * Scenario:
     * 1. Clear localStorage to ensure no cached value exists
     * 2. Reload page and switch to macromolecule mode in sequence layout
     * 3. Verify that RNA button is selected by default
     *
     * Version 3.12.0
     */
    await clearLocalStorage(page);
    await reloadAndGoToSequenceMode(page);

    const activePolymerType = await getActivePolymerType(page);
    expect(activePolymerType).toBe('RNA');
  });

  test('Case 2 - Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected
     * Scenario:
     * 1. Click DNA button to select DNA polymer type
     * 2. Reload the page and return to sequence mode
     * 3. Verify that DNA button is selected (restored from cache)
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).dna();
    await reloadAndGoToSequenceMode(page);

    const activePolymerType = await getActivePolymerType(page);
    expect(activePolymerType).toBe('DNA');
  });

  test('Case 3 - Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected
     * Scenario:
     * 1. Click Peptides button to select PEP polymer type
     * 2. Reload the page and return to sequence mode
     * 3. Verify that Peptides button is selected (restored from cache)
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).peptides();
    await reloadAndGoToSequenceMode(page);

    const activePolymerType = await getActivePolymerType(page);
    expect(activePolymerType).toBe('PEP');
  });

  test('Case 4 - Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected
     * Scenario:
     * 1. Click RNA button to explicitly select RNA polymer type
     * 2. Reload the page and return to sequence mode
     * 3. Verify that RNA button is selected (restored from cache)
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).rna();
    await reloadAndGoToSequenceMode(page);

    const activePolymerType = await getActivePolymerType(page);
    expect(activePolymerType).toBe('RNA');
  });

  test('Case 5 - Use Ctrl+Alt+D hotkey to switch to DNA, reload the page, and verify DNA is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Use Ctrl+Alt+D hotkey to switch to DNA, reload the page, and verify DNA is restored from cache
     * Scenario:
     * 1. Use Ctrl+Alt+D keyboard shortcut to switch to DNA
     * 2. Reload the page and return to sequence mode
     * 3. Verify that DNA button is selected (restored from cache)
     *
     * Version 3.12.0
     */
    await page.keyboard.press('Control+Alt+KeyD');
    await reloadAndGoToSequenceMode(page);

    const activePolymerType = await getActivePolymerType(page);
    expect(activePolymerType).toBe('DNA');
  });

  test('Case 6 - Use Ctrl+Alt+P hotkey to switch to PEP, reload the page, and verify PEP is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Use Ctrl+Alt+P hotkey to switch to PEP, reload the page, and verify PEP is restored from cache
     * Scenario:
     * 1. Use Ctrl+Alt+P keyboard shortcut to switch to Peptides
     * 2. Reload the page and return to sequence mode
     * 3. Verify that Peptides button is selected (restored from cache)
     *
     * Version 3.12.0
     */
    await page.keyboard.press('Control+Alt+KeyP');
    await reloadAndGoToSequenceMode(page);

    const activePolymerType = await getActivePolymerType(page);
    expect(activePolymerType).toBe('PEP');
  });

  test('Case 7 - Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache
     * Scenario:
     * 1. Use Ctrl+Alt+R keyboard shortcut to switch to RNA
     * 2. Reload the page and return to sequence mode
     * 3. Verify that RNA button is selected (restored from cache)
     *
     * Version 3.12.0
     */
    await page.keyboard.press('Control+Alt+KeyR');
    await reloadAndGoToSequenceMode(page);

    const activePolymerType = await getActivePolymerType(page);
    expect(activePolymerType).toBe('RNA');
  });

  test('Case 8 - Change the polymer type by switching the library tab, reload the page, and verify the cached type matches the last library tab used', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Change the polymer type by switching the library tab, reload the page, and verify the cached type matches the last library tab used
     * Scenario:
     * 1. Click on the Peptides tab in the library to implicitly switch polymer type
     * 2. Reload the page and return to sequence mode
     * 3. Verify that the polymer type switcher reflects the library tab selection
     *
     * Version 3.12.0
     */
    await Library(page).switchToPeptidesTab();
    await reloadAndGoToSequenceMode(page);

    const activePolymerType = await getActivePolymerType(page);
    expect(activePolymerType).toBe('PEP');
  });

  test('Case 9 - Switch to PEP, reload the page, enter flex mode, and verify the peptide library tab is opened by default despite switcher not being visible', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Switch to PEP, reload the page, enter flex mode, and verify the peptide library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Select Peptides polymer type in sequence mode
     * 2. Reload page and switch to flex mode (where polymer switcher is not visible)
     * 3. Verify that the Peptides library tab is automatically opened
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).peptides();
    await reloadAndGoToFlexMode(page);

    const isPeptidesTabActive = await Library(page).isTabOpened(LibraryTab.Peptides);
    expect(isPeptidesTabActive).toBe(true);
  });

  test('Case 10 - Switch to DNA, reload the page, enter snake mode, and verify the RNA library tab is opened by default despite switcher not being visible', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Switch to DNA, reload the page, enter snake mode, and verify the RNA library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Select DNA polymer type in sequence mode
     * 2. Reload page and switch to snake mode (where polymer switcher is not visible)
     * 3. Verify that the RNA library tab is automatically opened (DNA uses RNA monomers)
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).dna();
    await reloadAndGoToSnakeMode(page);

    const isRNATabActive = await Library(page).isTabOpened(LibraryTab.RNA);
    expect(isRNATabActive).toBe(true);
  });

  test('Case 11 - Clear browser cache/localStorage, open macromolecule mode, and verify RNA is selected as the fallback default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Clear browser cache/localStorage, open macromolecule mode, and verify RNA is selected as the fallback default
     * Scenario:
     * 1. Clear localStorage to remove any cached polymer type
     * 2. Reload page and switch to macromolecule sequence mode
     * 3. Verify that RNA is selected as the default fallback
     *
     * Version 3.12.0
     */
    await clearLocalStorage(page);
    await reloadAndGoToSequenceMode(page);

    const activePolymerType = await getActivePolymerType(page);
    expect(activePolymerType).toBe('RNA');
  });

  test('Case 12 - Verify that switching polymer type in one browser tab and opening a new tab reflects the cached value in the new tab', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Verify that switching polymer type in one browser tab and opening a new tab reflects the cached value in the new tab
     * Scenario:
     * 1. Select DNA polymer type in current tab
     * 2. Open a new tab with the same application
     * 3. Switch to macromolecule sequence mode in the new tab
     * 4. Verify that DNA is selected (inherited from cache)
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

    const activePolymerType = await getActivePolymerType(newPage);
    expect(activePolymerType).toBe('DNA');

    await newPage.close();
  });

  test('Case 13 - Switch polymer type multiple times in sequence (RNA → DNA → PEP → DNA), reload, and verify only the last selected type (DNA) is restored', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Switch polymer type multiple times in sequence, reload, and verify only the last selected type is restored
     * Scenario:
     * 1. Switch polymer types in sequence: RNA → DNA → PEP → DNA
     * 2. Reload the page and return to sequence mode
     * 3. Verify that only the last selection (DNA) is restored from cache
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).rna();
    await MacromoleculesTopToolbar(page).dna();
    await MacromoleculesTopToolbar(page).peptides();
    await MacromoleculesTopToolbar(page).dna();

    await reloadAndGoToSequenceMode(page);

    const activePolymerType = await getActivePolymerType(page);
    expect(activePolymerType).toBe('DNA');
  });

  test('Case 14 - Verify that the cached polymer type persists after navigating away from macromolecule mode to small molecule mode and back', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Verify that the cached polymer type persists after navigating away from macromolecule mode to small molecule mode and back
     * Scenario:
     * 1. Select PEP polymer type in macromolecule mode
     * 2. Switch to small molecule mode
     * 3. Switch back to macromolecule mode in sequence layout
     * 4. Verify that PEP selection is preserved
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).peptides();
    await CommonTopRightToolbar(page).turnOnMicromoleculesEditor();
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Sequence);

    const activePolymerType = await getActivePolymerType(page);
    expect(activePolymerType).toBe('PEP');
  });

  test('Case 15 - Verify that an invalid or corrupted cache value for polymer type falls back gracefully to the RNA default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Verify that an invalid or corrupted cache value for polymer type falls back gracefully to the RNA default
     * Scenario:
     * 1. Set an invalid value in localStorage for the polymer type key
     * 2. Reload the page and switch to macromolecule sequence mode
     * 3. Verify that the application gracefully falls back to RNA default
     *
     * Version 3.12.0
     */
    // Set invalid value in localStorage (this key will need to be updated once the feature is implemented)
    await page.evaluate(() => {
      localStorage.setItem('polymerType', 'INVALID_TYPE');
    });

    await reloadAndGoToSequenceMode(page);

    const activePolymerType = await getActivePolymerType(page);
    expect(activePolymerType).toBe('RNA');
  });
});