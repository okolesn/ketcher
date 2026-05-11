import { test, expect } from '@playwright/test';
import { 
  initMoleculesCanvas,
  MacromoleculeCanvas,
  pageReload,
  clearLocalStorage,
  keyboardPressOnCanvas,
  MODIFIED_POLYMER_TYPE_CACHE,
} from '@tests';

/**
 * AutoTest Request: https://github.com/okolesn/ketcher/issues/8
 * Feature Issue: https://github.com/okolesn/ketcher/issues/2
 * Description: Save the polymer type switcher (RNA/DNA/PEP) to browser cache
 * 
 * Test scenarios:
 * - Default behavior when no cache exists (defaults to RNA)
 * - Persistence after page reload for each polymer type
 * - Hotkey support with cache persistence
 * - Library tab switching cache persistence  
 * - Layout mode compatibility (Flex and Snake modes)
 * - Cache management and fallback behavior
 * - Multi-tab support for cache sharing
 * - Sequential switching behavior
 * - Mode switching persistence
 * - Error handling for corrupted cache values
 */

test.describe('Polymer Type Switcher Cache Tests', () => {
  let macromoleculeCanvas: MacromoleculeCanvas;

  test.beforeAll(async ({ page }) => {
    // Initialize the canvas and switch to macromolecule mode
    macromoleculeCanvas = await initMoleculesCanvas(page);
    await macromoleculeCanvas.switchToMacromoleculeMode();
  });

  test.afterAll(async ({ page }) => {
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test for clean state
    await clearLocalStorage(page);
    await pageReload(page);
    await macromoleculeCanvas.switchToMacromoleculeMode();
  });

  test('Default RNA selection when no cached value exists', async ({ page }) => {
    // Verify that when no cached value exists, macromolecule mode defaults to RNA
    await expect(page.getByTestId('RNA-tab')).toHaveClass(/selected/);
    await expect(page.getByTestId('polymer-type-switcher')).toContainText('RNA');
  });

  test('DNA persistence after page reload via switcher', async ({ page }) => {
    // Select DNA via the polymer type switcher
    await page.getByTestId('polymer-type-switcher').click();
    await page.getByTestId('DNA-option').click();
    
    // Reload the page
    await pageReload(page);
    await macromoleculeCanvas.switchToMacromoleculeMode();
    
    // Verify macromolecule mode reopens with DNA selected
    await expect(page.getByTestId('DNA-tab')).toHaveClass(/selected/);
    await expect(page.getByTestId('polymer-type-switcher')).toContainText('DNA');
  });

  test('PEP persistence after page reload via switcher', async ({ page }) => {
    // Select PEP via the polymer type switcher
    await page.getByTestId('polymer-type-switcher').click();
    await page.getByTestId('PEP-option').click();
    
    // Reload the page
    await pageReload(page);
    await macromoleculeCanvas.switchToMacromoleculeMode();
    
    // Verify macromolecule mode reopens with PEP selected
    await expect(page.getByTestId('PEP-tab')).toHaveClass(/selected/);
    await expect(page.getByTestId('polymer-type-switcher')).toContainText('PEP');
  });

  test('RNA explicit selection persistence after page reload', async ({ page }) => {
    // Explicitly select RNA via the polymer type switcher
    await page.getByTestId('polymer-type-switcher').click();
    await page.getByTestId('RNA-option').click();
    
    // Reload the page
    await pageReload(page);
    await macromoleculeCanvas.switchToMacromoleculeMode();
    
    // Verify macromolecule mode reopens with RNA selected
    await expect(page.getByTestId('RNA-tab')).toHaveClass(/selected/);
    await expect(page.getByTestId('polymer-type-switcher')).toContainText('RNA');
  });

  test('DNA hotkey (Ctrl+Alt+D) persistence after page reload', async ({ page }) => {
    // Use Ctrl+Alt+D hotkey to switch to DNA
    await keyboardPressOnCanvas(page, 'Control+Alt+KeyD');
    
    // Reload the page
    await pageReload(page);
    await macromoleculeCanvas.switchToMacromoleculeMode();
    
    // Verify DNA is restored from cache
    await expect(page.getByTestId('DNA-tab')).toHaveClass(/selected/);
    await expect(page.getByTestId('polymer-type-switcher')).toContainText('DNA');
  });

  test('PEP hotkey (Ctrl+Alt+P) persistence after page reload', async ({ page }) => {
    // Use Ctrl+Alt+P hotkey to switch to PEP
    await keyboardPressOnCanvas(page, 'Control+Alt+KeyP');
    
    // Reload the page
    await pageReload(page);
    await macromoleculeCanvas.switchToMacromoleculeMode();
    
    // Verify PEP is restored from cache
    await expect(page.getByTestId('PEP-tab')).toHaveClass(/selected/);
    await expect(page.getByTestId('polymer-type-switcher')).toContainText('PEP');
  });

  test('RNA hotkey (Ctrl+Alt+R) persistence after page reload', async ({ page }) => {
    // Use Ctrl+Alt+R hotkey to switch to RNA
    await keyboardPressOnCanvas(page, 'Control+Alt+KeyR');
    
    // Reload the page
    await pageReload(page);
    await macromoleculeCanvas.switchToMacromoleculeMode();
    
    // Verify RNA is restored from cache
    await expect(page.getByTestId('RNA-tab')).toHaveClass(/selected/);
    await expect(page.getByTestId('polymer-type-switcher')).toContainText('RNA');
  });

  test('Library tab switching cache persistence', async ({ page }) => {
    // Change polymer type by switching to peptides library tab
    await page.getByTestId('peptides-library-tab').click();
    
    // Reload the page
    await pageReload(page);
    await macromoleculeCanvas.switchToMacromoleculeMode();
    
    // Verify the cached type matches the last library tab used
    await expect(page.getByTestId('PEP-tab')).toHaveClass(/selected/);
    await expect(page.getByTestId('polymer-type-switcher')).toContainText('PEP');
  });

  test('PEP cache persistence in flex mode', async ({ page }) => {
    // Switch to PEP
    await page.getByTestId('polymer-type-switcher').click();
    await page.getByTestId('PEP-option').click();
    
    // Reload the page and enter flex mode
    await pageReload(page);
    await macromoleculeCanvas.switchToMacromoleculeMode();
    await page.getByTestId('flex-mode-button').click();
    
    // Verify peptide library tab is opened by default despite switcher not being visible
    await expect(page.getByTestId('peptides-library-tab')).toHaveClass(/selected/);
  });

  test('DNA cache persistence in snake mode', async ({ page }) => {
    // Switch to DNA
    await page.getByTestId('polymer-type-switcher').click();
    await page.getByTestId('DNA-option').click();
    
    // Reload the page and enter snake mode
    await pageReload(page);
    await macromoleculeCanvas.switchToMacromoleculeMode();
    await page.getByTestId('snake-mode-button').click();
    
    // Verify DNA library tab is opened by default despite switcher not being visible
    await expect(page.getByTestId('nucleotides-library-tab')).toHaveClass(/selected/);
  });

  test('Cache clear fallback to RNA default', async ({ page }) => {
    // First set a non-default polymer type
    await page.getByTestId('polymer-type-switcher').click();
    await page.getByTestId('DNA-option').click();
    
    // Clear browser cache/localStorage
    await clearLocalStorage(page);
    
    // Reload and open macromolecule mode
    await pageReload(page);
    await macromoleculeCanvas.switchToMacromoleculeMode();
    
    // Verify RNA is selected as the fallback default
    await expect(page.getByTestId('RNA-tab')).toHaveClass(/selected/);
    await expect(page.getByTestId('polymer-type-switcher')).toContainText('RNA');
  });

  test('Multi-tab cache sharing', async ({ page, browser }) => {
    // Switch polymer type in current tab
    await page.getByTestId('polymer-type-switcher').click();
    await page.getByTestId('PEP-option').click();
    
    // Open a new tab
    const newPage = await browser.newPage();
    const newCanvas = await initMoleculesCanvas(newPage);
    await newCanvas.switchToMacromoleculeMode();
    
    // Verify cached value is reflected in the new tab
    await expect(newPage.getByTestId('PEP-tab')).toHaveClass(/selected/);
    await expect(newPage.getByTestId('polymer-type-switcher')).toContainText('PEP');
    
    await newPage.close();
  });

  test('Sequential switching behavior - last selection wins', async ({ page }) => {
    // Switch polymer type multiple times in sequence (RNA → DNA → PEP → DNA)
    await page.getByTestId('polymer-type-switcher').click();
    await page.getByTestId('RNA-option').click();
    
    await page.getByTestId('polymer-type-switcher').click();
    await page.getByTestId('DNA-option').click();
    
    await page.getByTestId('polymer-type-switcher').click();
    await page.getByTestId('PEP-option').click();
    
    await page.getByTestId('polymer-type-switcher').click();
    await page.getByTestId('DNA-option').click();
    
    // Reload the page
    await pageReload(page);
    await macromoleculeCanvas.switchToMacromoleculeMode();
    
    // Verify only the last selected type (DNA) is restored
    await expect(page.getByTestId('DNA-tab')).toHaveClass(/selected/);
    await expect(page.getByTestId('polymer-type-switcher')).toContainText('DNA');
  });

  test('Mode switching persistence', async ({ page }) => {
    // Switch to PEP polymer type
    await page.getByTestId('polymer-type-switcher').click();
    await page.getByTestId('PEP-option').click();
    
    // Navigate to small molecule mode
    await page.getByTestId('molecules-mode-button').click();
    
    // Navigate back to macromolecule mode
    await page.getByTestId('macromolecules-mode-button').click();
    
    // Verify cached polymer type persists
    await expect(page.getByTestId('PEP-tab')).toHaveClass(/selected/);
    await expect(page.getByTestId('polymer-type-switcher')).toContainText('PEP');
  });

  test('Corrupted cache value fallback', async ({ page }) => {
    // Set an invalid/corrupted cache value for polymer type
    await page.evaluate(() => {
      localStorage.setItem('polymer_type_cache', 'invalid_value');
    });
    
    // Reload and open macromolecule mode
    await pageReload(page);
    await macromoleculeCanvas.switchToMacromoleculeMode();
    
    // Verify graceful fallback to RNA default
    await expect(page.getByTestId('RNA-tab')).toHaveClass(/selected/);
    await expect(page.getByTestId('polymer-type-switcher')).toContainText('RNA');
  });
});