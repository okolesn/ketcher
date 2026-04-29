import { Page, test, expect } from '@fixtures';
import { CommonTopRightToolbar } from '@tests/pages/common/CommonTopRightToolbar';
import { MacromoleculesTopToolbar } from '@tests/pages/macromolecules/MacromoleculesTopToolbar';
import { Library } from '@tests/pages/macromolecules/Library';
import { LayoutMode } from '@tests/pages/constants/macromoleculesTopToolbar/Constants';
import { clearLocalStorage } from '@utils/common/helpers';

let page: Page;

test.describe('Autotests: Save the polymer type switcher (RNA/DNA/PEP) to browser cache', () => {
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
     * 1. Clear localStorage to ensure no cached value exists
     * 2. Reload page and go to sequence mode
     * 3. Verify RNA button is active (default)
     *
     * Version 3.12.0
     */
    await clearLocalStorage(page);
    await reloadAndGoToSequenceMode();
    
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveClass(/MuiButton-contained/);
  });

  test('Case 2 - Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Select DNA via the polymer type switcher, reload the page, and verify macromolecule mode reopens with DNA selected
     * Scenario:
     * 1. Click DNA button
     * 2. Reload page and go to sequence mode
     * 3. Verify DNA button is active after reload
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).dna();
    await reloadAndGoToSequenceMode();
    
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    await expect(dnaButton).toHaveClass(/MuiButton-contained/);
  });

  test('Case 3 - Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Select PEP via the polymer type switcher, reload the page, and verify macromolecule mode reopens with PEP selected
     * Scenario:
     * 1. Click PEP button
     * 2. Reload page and go to sequence mode
     * 3. Verify PEP button is active after reload
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).peptides();
    await reloadAndGoToSequenceMode();
    
    const pepButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(pepButton).toHaveClass(/MuiButton-contained/);
  });

  test('Case 4 - Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Select RNA explicitly via the polymer type switcher, reload the page, and verify macromolecule mode reopens with RNA selected
     * Scenario:
     * 1. Click RNA button explicitly
     * 2. Reload page and go to sequence mode
     * 3. Verify RNA button is active after reload
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).rna();
    await reloadAndGoToSequenceMode();
    
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveClass(/MuiButton-contained/);
  });

  test('Case 5 - Use Ctrl+Alt+D hotkey to switch to DNA, reload the page, and verify DNA is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Use Ctrl+Alt+D hotkey to switch to DNA, reload the page, and verify DNA is restored from cache
     * Scenario:
     * 1. Press Ctrl+Alt+D hotkey to switch to DNA
     * 2. Reload page and go to sequence mode
     * 3. Verify DNA button is active after reload
     *
     * Version 3.12.0
     */
    await page.keyboard.press('ControlOrMeta+Alt+d');
    await reloadAndGoToSequenceMode();
    
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    await expect(dnaButton).toHaveClass(/MuiButton-contained/);
  });

  test('Case 6 - Use Ctrl+Alt+P hotkey to switch to PEP, reload the page, and verify PEP is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Use Ctrl+Alt+P hotkey to switch to PEP, reload the page, and verify PEP is restored from cache
     * Scenario:
     * 1. Press Ctrl+Alt+P hotkey to switch to PEP
     * 2. Reload page and go to sequence mode
     * 3. Verify PEP button is active after reload
     *
     * Version 3.12.0
     */
    await page.keyboard.press('ControlOrMeta+Alt+p');
    await reloadAndGoToSequenceMode();
    
    const pepButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(pepButton).toHaveClass(/MuiButton-contained/);
  });

  test('Case 7 - Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Use Ctrl+Alt+R hotkey to switch to RNA, reload the page, and verify RNA is restored from cache
     * Scenario:
     * 1. Press Ctrl+Alt+R hotkey to switch to RNA
     * 2. Reload page and go to sequence mode
     * 3. Verify RNA button is active after reload
     *
     * Version 3.12.0
     */
    await page.keyboard.press('ControlOrMeta+Alt+r');
    await reloadAndGoToSequenceMode();
    
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveClass(/MuiButton-contained/);
  });

  test('Case 8 - Change the polymer type by switching the library tab (e.g., to peptides tab), reload the page, and verify the cached type matches the last library tab used', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Change the polymer type by switching the library tab (e.g., to peptides tab), reload the page, and verify the cached type matches the last library tab used
     * Scenario:
     * 1. Switch to peptides library tab
     * 2. Reload page and go to sequence mode
     * 3. Verify PEP button is active after reload
     *
     * Version 3.12.0
     */
    await Library(page).switchToPeptidesTab();
    await reloadAndGoToSequenceMode();
    
    const pepButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(pepButton).toHaveClass(/MuiButton-contained/);
  });

  test('Case 9 - Switch to PEP, reload the page, enter flex mode, and verify the peptide library tab is opened by default despite switcher not being visible', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Switch to PEP, reload the page, enter flex mode, and verify the peptide library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Switch to PEP
     * 2. Reload page and go to flex mode
     * 3. Verify peptides library tab is selected
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).peptides();
    await reloadAndGoToFlexMode();
    
    const peptidesTab = Library(page).peptidesTab;
    await expect(peptidesTab).toHaveAttribute('data-selected', 'true');
  });

  test('Case 10 - Switch to DNA, reload the page, enter snake mode, and verify the DNA library tab is opened by default despite switcher not being visible', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Switch to DNA, reload the page, enter snake mode, and verify the DNA library tab is opened by default despite switcher not being visible
     * Scenario:
     * 1. Switch to DNA
     * 2. Reload page and go to snake mode
     * 3. Verify RNA library tab is selected (DNA uses RNA library)
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).dna();
    await reloadAndGoToSnakeMode();
    
    const rnaTab = Library(page).rnaTab;
    await expect(rnaTab).toHaveAttribute('data-selected', 'true');
  });

  test('Case 11 - Clear browser cache/localStorage, open macromolecule mode, and verify RNA is selected as the fallback default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Clear browser cache/localStorage, open macromolecule mode, and verify RNA is selected as the fallback default
     * Scenario:
     * 1. Clear localStorage
     * 2. Reload page and go to sequence mode
     * 3. Verify RNA button is active (fallback default)
     *
     * Version 3.12.0
     */
    await clearLocalStorage(page);
    await reloadAndGoToSequenceMode();
    
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveClass(/MuiButton-contained/);
  });

  test('Case 12 - Verify that switching polymer type in one browser tab and opening a new tab reflects the cached value in the new tab', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Verify that switching polymer type in one browser tab and opening a new tab reflects the cached value in the new tab
     * Scenario:
     * 1. Switch to DNA in current tab
     * 2. Open a new tab
     * 3. Go to sequence mode in new tab
     * 4. Verify DNA button is active in new tab
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).dna();
    
    const newPage = await page.context().newPage();
    await newPage.goto(page.url());
    await CommonTopRightToolbar(newPage).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(newPage).selectLayoutModeTool(LayoutMode.Sequence);
    
    const dnaButton = MacromoleculesTopToolbar(newPage).dnaButton;
    await expect(dnaButton).toHaveClass(/MuiButton-contained/);
    
    await newPage.close();
  });

  test('Case 13 - Switch polymer type multiple times in sequence (RNA → DNA → PEP → DNA), reload, and verify only the last selected type (DNA) is restored', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Switch polymer type multiple times in sequence (RNA → DNA → PEP → DNA), reload, and verify only the last selected type (DNA) is restored
     * Scenario:
     * 1. Switch RNA → DNA → PEP → DNA in sequence
     * 2. Reload page and go to sequence mode
     * 3. Verify DNA button is active (last selection)
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).rna();
    await MacromoleculesTopToolbar(page).dna();
    await MacromoleculesTopToolbar(page).peptides();
    await MacromoleculesTopToolbar(page).dna();
    
    await reloadAndGoToSequenceMode();
    
    const dnaButton = MacromoleculesTopToolbar(page).dnaButton;
    await expect(dnaButton).toHaveClass(/MuiButton-contained/);
  });

  test('Case 14 - Verify that the cached polymer type persists after navigating away from macromolecule mode to small molecule mode and back', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Verify that the cached polymer type persists after navigating away from macromolecule mode to small molecule mode and back
     * Scenario:
     * 1. Switch to PEP
     * 2. Switch to micro mode
     * 3. Switch back to macro mode (sequence)
     * 4. Verify PEP button is still active
     *
     * Version 3.12.0
     */
    await MacromoleculesTopToolbar(page).peptides();
    await CommonTopRightToolbar(page).turnOnMicromoleculesEditor();
    await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
    await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Sequence);
    
    const pepButton = MacromoleculesTopToolbar(page).peptidesButton;
    await expect(pepButton).toHaveClass(/MuiButton-contained/);
  });

  test('Case 15 - Verify that an invalid or corrupted cache value for polymer type falls back gracefully to the RNA default', async () => {
    /*
     * Test task: https://github.com/okolesn/ketcher/issues/3
     * Description: Verify that an invalid or corrupted cache value for polymer type falls back gracefully to the RNA default
     * Scenario:
     * 1. Set invalid value in localStorage for polymer type
     * 2. Reload page and go to sequence mode
     * 3. Verify RNA button is active (fallback default)
     *
     * Version 3.12.0
     */
    await page.evaluate(() => {
      localStorage.setItem('polymerType', 'invalid_value');
    });
    
    await reloadAndGoToSequenceMode();
    
    const rnaButton = MacromoleculesTopToolbar(page).rnaButton;
    await expect(rnaButton).toHaveClass(/MuiButton-contained/);
  });
});

// Helper functions
async function reloadAndGoToSequenceMode() {
  await page.reload();
  await page.goto('', { waitUntil: 'domcontentloaded' });
  await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
  await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Sequence);
}

async function reloadAndGoToFlexMode() {
  await page.reload();
  await page.goto('', { waitUntil: 'domcontentloaded' });
  await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
  await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Flex);
}

async function reloadAndGoToSnakeMode() {
  await page.reload();
  await page.goto('', { waitUntil: 'domcontentloaded' });
  await CommonTopRightToolbar(page).turnOnMacromoleculesEditor();
  await MacromoleculesTopToolbar(page).selectLayoutModeTool(LayoutMode.Snake);
}