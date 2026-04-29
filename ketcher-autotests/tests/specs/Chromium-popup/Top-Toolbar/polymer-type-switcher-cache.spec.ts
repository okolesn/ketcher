/* eslint-disable no-magic-numbers */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Page, test, expect } from '@fixtures';
import { CommonTopRightToolbar } from '@tests/pages/common/CommonTopRightToolbar';
import { MacromoleculesTopToolbar } from '@tests/pages/macromolecules/MacromoleculesTopToolbar';
import { Library } from '@tests/pages/macromolecules/Library';
import { LayoutMode } from '@tests/pages/constants/macromoleculesTopToolbar/Constants';
import { LibraryTab } from '@tests/pages/constants/library/Constants';
import { clearLocalStorage } from '@utils/common/helpers';
import { waitForKetcherInit } from '@utils';

let page: Page;

async function switchToMacroModeOnly(p: Page) {
  const macroCanvas = p.locator('#polymer-editor-canvas');
  if (!(await macroCanvas.isVisible())) {
    const switcher = p
      .getByTestId('polymer-toggler')
      .filter({ has: p.locator(':visible') });
    await switcher.waitFor({ state: 'visible' });
    await switcher.click();
    await p.getByTestId('macromolecules_mode').waitFor({ state: 'visible' });
    await p.getByTestId('macromolecules_mode').click();
    await p.getByTestId('layout-mode').waitFor({ state: 'visible' });
  }
  await p.evaluate(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window._ketcher_isAutozoomDisabled = true;
  });
}

async function reloadAndGoToSequenceMode(p: Page) {
  await p.reload();
  await p.goto('', { waitUntil: 'domcontentloaded' });
  await waitForKetcherInit(p);
  await switchToMacroModeOnly(p);
  await MacromoleculesTopToolbar(p).selectLayoutModeTool(LayoutMode.Sequence);
}

async function reloadAndGoToFlexMode(p: Page) {
  await p.reload();
  await p.goto('', { waitUntil: 'domcontentloaded' });
  await waitForKetcherInit(p);
  await switchToMacroModeOnly(p);
  await MacromoleculesTopToolbar(p).selectLayoutModeTool(LayoutMode.Flex);
}

async function reloadAndGoToSnakeMode(p: Page) {
  await p.reload();
  await p.goto('', { waitUntil: 'domcontentloaded' });
  await waitForKetcherInit(p);
  await switchToMacroModeOnly(p);
  await MacromoleculesTopToolbar(p).selectLayoutModeTool(LayoutMode.Snake);
}

async function isPolymerButtonActive(p: Page, testId: string): Promise<boolean> {
  const className = await p.getByTestId(testId).getAttribute('class');
  return className?.includes('MuiButton-contained') ?? false;
}

test.describe('Polymer type switcher cache (RNA/DNA/PEP)', () => {
  test.beforeAll(async ({ initSequenceCanvas }) => {
    page = await initSequenceCanvas();
  });

  test.afterAll(async ({ closePage }) => {
    await closePage();
  });

  test.beforeEach(async () => {
    await clearLocalStorage(page);
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor({
      enableFlexMode: true,
      goToPeptides: false,
      disableChainLengthRuler: true,
      disableAutozoom: true,
    });
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(
      LayoutMode.Sequence,
    );
  });

  test('Case 1 - When no cached value exists, switching to macromolecule sequence mode defaults to RNA polymer type', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Verify RNA is selected as the default polymer type when no localStorage cache exists
     * Scenario:
     * 1. Clear browser localStorage
     * 2. Reload page
     * 3. Open macromolecule editor in sequence layout mode
     * 4. Verify RNA button is active and DNA/PEP buttons are inactive
     *
     * Version 3.12.0
     */
    await clearLocalStorage(page);
    await reloadAndGoToSequenceMode(page);

    expect(await isPolymerButtonActive(page, 'RNABtn')).toBeTruthy();
    expect(await isPolymerButtonActive(page, 'DNABtn')).toBeFalsy();
    expect(await isPolymerButtonActive(page, 'PEPTIDEBtn')).toBeFalsy();
  });

  test('Case 2 - Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Verify DNA polymer type is restored from cache after page reload
     * Scenario:
     * 1. Open macromolecule editor in sequence layout mode
     * 2. Select DNA via the polymer type switcher
     * 3. Reload the page
     * 4. Open macromolecule editor in sequence layout mode
     * 5. Verify DNA button is active
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).dna();
    expect(await isPolymerButtonActive(page, 'DNABtn')).toBeTruthy();

    await reloadAndGoToSequenceMode(page);

    expect(await isPolymerButtonActive(page, 'DNABtn')).toBeTruthy();
    expect(await isPolymerButtonActive(page, 'RNABtn')).toBeFalsy();
    expect(await isPolymerButtonActive(page, 'PEPTIDEBtn')).toBeFalsy();
  });

  test('Case 3 - Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Verify PEP polymer type is restored from cache after page reload
     * Scenario:
     * 1. Open macromolecule editor in sequence layout mode
     * 2. Select PEP via the polymer type switcher
     * 3. Reload the page
     * 4. Open macromolecule editor in sequence layout mode
     * 5. Verify PEP button is active
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).peptides();
    expect(await isPolymerButtonActive(page, 'PEPTIDEBtn')).toBeTruthy();

    await reloadAndGoToSequenceMode(page);

    expect(await isPolymerButtonActive(page, 'PEPTIDEBtn')).toBeTruthy();
    expect(await isPolymerButtonActive(page, 'RNABtn')).toBeFalsy();
    expect(await isPolymerButtonActive(page, 'DNABtn')).toBeFalsy();
  });

  test('Case 4 - Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Verify explicit RNA selection is persisted in cache across page reload
     * Scenario:
     * 1. Open macromolecule editor in sequence layout mode
     * 2. Switch to DNA, then switch back to RNA explicitly
     * 3. Reload the page
     * 4. Open macromolecule editor in sequence layout mode
     * 5. Verify RNA button is active
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).dna();
    await MacromoleculesTopToolbar(page).rna();
    expect(await isPolymerButtonActive(page, 'RNABtn')).toBeTruthy();

    await reloadAndGoToSequenceMode(page);

    expect(await isPolymerButtonActive(page, 'RNABtn')).toBeTruthy();
    expect(await isPolymerButtonActive(page, 'DNABtn')).toBeFalsy();
    expect(await isPolymerButtonActive(page, 'PEPTIDEBtn')).toBeFalsy();
  });

  test('Case 5 - Use Ctrl+Alt+D hotkey to switch to DNA, reload the page, and verify DNA is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Verify DNA polymer type set via Ctrl+Alt+D hotkey is saved to cache
     * Scenario:
     * 1. Open macromolecule editor in sequence layout mode
     * 2. Press Ctrl+Alt+D to switch to DNA
     * 3. Reload the page
     * 4. Open macromolecule editor in sequence layout mode
     * 5. Verify DNA button is active
     *
     * Version 3.12.0
     */
    await page.keyboard.press('Control+Alt+D');
    expect(await isPolymerButtonActive(page, 'DNABtn')).toBeTruthy();

    await reloadAndGoToSequenceMode(page);

    expect(await isPolymerButtonActive(page, 'DNABtn')).toBeTruthy();
    expect(await isPolymerButtonActive(page, 'RNABtn')).toBeFalsy();
    expect(await isPolymerButtonActive(page, 'PEPTIDEBtn')).toBeFalsy();
  });

  test('Case 6 - Use Ctrl+Alt+P hotkey to switch to PEP, reload the page, and verify PEP is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Verify PEP polymer type set via Ctrl+Alt+P hotkey is saved to cache
     * Scenario:
     * 1. Open macromolecule editor in sequence layout mode
     * 2. Press Ctrl+Alt+P to switch to PEP
     * 3. Reload the page
     * 4. Open macromolecule editor in sequence layout mode
     * 5. Verify PEP button is active
     *
     * Version 3.12.0
     */
    await page.keyboard.press('Control+Alt+P');
    expect(await isPolymerButtonActive(page, 'PEPTIDEBtn')).toBeTruthy();

    await reloadAndGoToSequenceMode(page);

    expect(await isPolymerButtonActive(page, 'PEPTIDEBtn')).toBeTruthy();
    expect(await isPolymerButtonActive(page, 'RNABtn')).toBeFalsy();
    expect(await isPolymerButtonActive(page, 'DNABtn')).toBeFalsy();
  });

  test('Case 7 - Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Verify RNA polymer type set via Ctrl+Alt+R hotkey is saved to cache
     * Scenario:
     * 1. Open macromolecule editor in sequence layout mode
     * 2. Switch to DNA first, then press Ctrl+Alt+R to switch back to RNA
     * 3. Reload the page
     * 4. Open macromolecule editor in sequence layout mode
     * 5. Verify RNA button is active
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).dna();
    await page.keyboard.press('Control+Alt+R');
    expect(await isPolymerButtonActive(page, 'RNABtn')).toBeTruthy();

    await reloadAndGoToSequenceMode(page);

    expect(await isPolymerButtonActive(page, 'RNABtn')).toBeTruthy();
    expect(await isPolymerButtonActive(page, 'DNABtn')).toBeFalsy();
    expect(await isPolymerButtonActive(page, 'PEPTIDEBtn')).toBeFalsy();
  });

  test('Case 8 - Change the polymer type by switching the library tab to peptides, reload, and verify the cached type matches the last library tab used', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Verify selecting PEP via the sequence mode toolbar (which switches library tab)
     *              saves the polymer type to cache
     * Scenario:
     * 1. Open macromolecule editor in sequence layout mode
     * 2. Click PEP button (which switches library to peptides tab)
     * 3. Reload the page
     * 4. Open macromolecule editor in sequence layout mode
     * 5. Verify PEP button is active and peptides library tab is shown
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).peptides();
    expect(await Library(page).isTabOpened(LibraryTab.Peptides)).toBeTruthy();

    await reloadAndGoToSequenceMode(page);

    expect(await isPolymerButtonActive(page, 'PEPTIDEBtn')).toBeTruthy();
    expect(await Library(page).isTabOpened(LibraryTab.Peptides)).toBeTruthy();
  });

  test('Case 9 - Switch to PEP, reload, enter flex mode, and verify the peptide library tab is opened by default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Verify cached PEP polymer type opens peptide library tab in flex mode
     *              even though the RNA/DNA/PEP switcher is not visible there
     * Scenario:
     * 1. Open macromolecule editor in sequence layout mode
     * 2. Select PEP via the polymer type switcher
     * 3. Reload the page
     * 4. Open macromolecule editor in flex layout mode (switcher not visible)
     * 5. Verify peptides library tab is active
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).peptides();

    await reloadAndGoToFlexMode(page);

    expect(await Library(page).isTabOpened(LibraryTab.Peptides)).toBeTruthy();
  });

  test('Case 10 - Switch to DNA, reload, enter snake mode, and verify the RNA library tab is opened by default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Verify cached DNA polymer type opens RNA library tab in snake mode
     *              even though the RNA/DNA/PEP switcher is not visible there
     * Scenario:
     * 1. Open macromolecule editor in sequence layout mode
     * 2. Select DNA via the polymer type switcher
     * 3. Reload the page
     * 4. Open macromolecule editor in snake layout mode (switcher not visible)
     * 5. Verify RNA library tab (not peptides) is active
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).dna();

    await reloadAndGoToSnakeMode(page);

    expect(await Library(page).isTabOpened(LibraryTab.RNA)).toBeTruthy();
    expect(await Library(page).isTabOpened(LibraryTab.Peptides)).toBeFalsy();
  });

  test('Case 11 - Clear browser localStorage, open macromolecule mode, and verify RNA is selected as the fallback default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Verify RNA is the fallback default when localStorage is cleared
     * Scenario:
     * 1. Select DNA via the polymer type switcher
     * 2. Clear browser localStorage
     * 3. Reload the page
     * 4. Open macromolecule editor in sequence layout mode
     * 5. Verify RNA button is active (fallback default)
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).dna();
    await clearLocalStorage(page);

    await reloadAndGoToSequenceMode(page);

    expect(await isPolymerButtonActive(page, 'RNABtn')).toBeTruthy();
    expect(await isPolymerButtonActive(page, 'DNABtn')).toBeFalsy();
    expect(await isPolymerButtonActive(page, 'PEPTIDEBtn')).toBeFalsy();
  });

  test('Case 12 - Switching polymer type and opening a new tab reflects the cached value', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Verify cached polymer type is shared across browser tabs (same browser context)
     * Scenario:
     * 1. Open macromolecule editor in sequence layout mode
     * 2. Select DNA via the polymer type switcher
     * 3. Open a new browser tab to the same application URL
     * 4. In the new tab, open macromolecule editor in sequence layout mode
     * 5. Verify DNA button is active in the new tab
     * 6. Close the new tab
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).dna();
    expect(await isPolymerButtonActive(page, 'DNABtn')).toBeTruthy();

    const currentUrl = page.url();
    const newPage = await page.context().newPage();

    try {
      await newPage.goto(currentUrl, { waitUntil: 'domcontentloaded' });
      await waitForKetcherInit(newPage);
      await switchToMacroModeOnly(newPage);
      await MacromoleculesTopToolbar(newPage).selectLayoutModeTool(
        LayoutMode.Sequence,
      );

      expect(await isPolymerButtonActive(newPage, 'DNABtn')).toBeTruthy();
      expect(await isPolymerButtonActive(newPage, 'RNABtn')).toBeFalsy();
    } finally {
      await newPage.close();
    }
  });

  test('Case 13 - Switch polymer type multiple times in sequence, reload, and verify only the last selected type is restored', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Verify only the last polymer type selection is persisted to cache
     * Scenario:
     * 1. Open macromolecule editor in sequence layout mode
     * 2. Switch polymer types: RNA -> DNA -> PEP -> DNA
     * 3. Reload the page
     * 4. Open macromolecule editor in sequence layout mode
     * 5. Verify DNA (the last selected type) is restored
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).rna();
    await MacromoleculesTopToolbar(page).dna();
    await MacromoleculesTopToolbar(page).peptides();
    await MacromoleculesTopToolbar(page).dna();
    expect(await isPolymerButtonActive(page, 'DNABtn')).toBeTruthy();

    await reloadAndGoToSequenceMode(page);

    expect(await isPolymerButtonActive(page, 'DNABtn')).toBeTruthy();
    expect(await isPolymerButtonActive(page, 'RNABtn')).toBeFalsy();
    expect(await isPolymerButtonActive(page, 'PEPTIDEBtn')).toBeFalsy();
  });

  test('Case 14 - Verify the cached polymer type persists after navigating away to small molecule mode and back', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Verify polymer type cache is preserved when switching between macro and micro modes
     * Scenario:
     * 1. Open macromolecule editor in sequence layout mode
     * 2. Select PEP via the polymer type switcher
     * 3. Switch to small molecule (micro) mode
     * 4. Switch back to macromolecule mode in sequence layout
     * 5. Verify PEP button is still active
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).peptides();
    expect(await isPolymerButtonActive(page, 'PEPTIDEBtn')).toBeTruthy();

    await CommonTopRightToolbar(page).turnOnMicromoleculesEditor();
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor({
      enableFlexMode: true,
      goToPeptides: false,
      disableChainLengthRuler: true,
      disableAutozoom: true,
    });
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Sequence);

    expect(await isPolymerButtonActive(page, 'PEPTIDEBtn')).toBeTruthy();
    expect(await isPolymerButtonActive(page, 'RNABtn')).toBeFalsy();
    expect(await isPolymerButtonActive(page, 'DNABtn')).toBeFalsy();
  });

  test('Case 15 - Verify that an invalid or corrupted cache value for polymer type falls back gracefully to the RNA default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/2
     * Description: Verify RNA is used as fallback when localStorage contains an invalid polymer type value
     * Note: The localStorage key name ('polymerType') should be confirmed once the feature is implemented
     * Scenario:
     * 1. Set an invalid value in localStorage under the polymer type cache key
     * 2. Reload the page
     * 3. Open macromolecule editor in sequence layout mode
     * 4. Verify RNA button is active (graceful fallback to default)
     *
     * Version 3.12.0
     */
    await page.evaluate(() => {
      // Note: update the key name to match the actual localStorage key once the feature is implemented
      localStorage.setItem('polymerType', JSON.stringify('INVALID_POLYMER_TYPE'));
    });

    await reloadAndGoToSequenceMode(page);

    expect(await isPolymerButtonActive(page, 'RNABtn')).toBeTruthy();
    expect(await isPolymerButtonActive(page, 'DNABtn')).toBeFalsy();
    expect(await isPolymerButtonActive(page, 'PEPTIDEBtn')).toBeFalsy();
  });
});
