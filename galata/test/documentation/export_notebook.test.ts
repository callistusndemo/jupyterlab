// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { expect, galata, test } from '@jupyterlab/galata';
import { setSidebarWidth } from './utils';

test.use({
  autoGoto: false,
  mockState: galata.DEFAULT_DOCUMENTATION_STATE,
  viewport: { height: 720, width: 1280 }
});

test.describe('Export Notebook', () => {
  test('Export Menu', async ({ page }) => {
    await page.goto();

    await setSidebarWidth(page);

    await page.dblclick(
      '[aria-label="File Browser Section"] >> text=notebooks'
    );
    await page.dblclick('text=Lorenz.ipynb');

    await page.waitForSelector('text=Python 3 (ipykernel) | Idle');

    await page.click('text=File');
    await page.click(
      '.lm-Menu ul[role="menu"] >> text=Save and Export Notebook As'
    );

    // Wait for Latex renderer
    await page.waitForSelector('text=(𝜎σ, 𝛽β, 𝜌ρ)');

    expect(
      await page.screenshot({ clip: { y: 5, x: 0, width: 700, height: 700 } })
    ).toMatchSnapshot('exporting_menu.png');
  });

  test('Slides', async ({ page }) => {
    await page.goto();

    await setSidebarWidth(page);

    await page
      .locator('[aria-label="File Browser Section"]')
      .getByText('notebooks')
      .dblclick();
    await page.getByText('Lorenz.ipynb').dblclick();

    await page.getByText('Python 3 (ipykernel) | Idle').waitFor();

    await page.getByTitle('Property Inspector').click();

    await page
      .locator('.jp-PropertyInspector')
      .getByText('Common Tools')
      .click();

    await page
      .locator('.jp-ActiveCellTool')
      .getByText(/# The Lorenz/)
      .waitFor();

    await page
      .locator(
        '#jp-MetadataForm-\\@jupyterlab\\/notebook-extension\\:tools_\\/slideshow\\/slide_type'
      )
      .selectOption({ label: 'Slide' });
    // Wait for Latex renderer
    await page.getByText('(𝜎σ, 𝛽β, 𝜌ρ)').waitFor();

    expect(
      await page.screenshot({ clip: { y: 5, x: 283, width: 997, height: 400 } })
    ).toMatchSnapshot('exporting_slide_type.png');
  });
});
