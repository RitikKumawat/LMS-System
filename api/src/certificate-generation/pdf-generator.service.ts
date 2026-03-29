import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Browser } from 'puppeteer';

// A4 landscape dimensions in CSS pixels at 96 DPI
const A4_LANDSCAPE_WIDTH = 1122;
const A4_LANDSCAPE_HEIGHT = 793;

@Injectable()
export class PdfGeneratorService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PdfGeneratorService.name);
  private browser: Browser | null = null;

  async onModuleInit() {
    this.logger.log('Launching Puppeteer browser...');
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });
    this.logger.log('Puppeteer browser launched successfully');
  }

  async onModuleDestroy() {
    if (this.browser) {
      this.logger.log('Closing Puppeteer browser...');
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Generate certificate PDF from fabric.js JSON and placeholder data
   */
  async generateCertificatePDF(
    fabricJson: string,
    backgroundUrl: string | null,
    placeholders: Record<string, string>,
  ): Promise<Buffer> {
    if (!this.browser) {
      throw new Error('Puppeteer browser not initialized');
    }

    const page = await this.browser.newPage();

    try {
      // Parse fabric.js JSON
      const fabricData = JSON.parse(fabricJson);

      // Set viewport to A4 landscape before setting content
      await page.setViewport({
        width: A4_LANDSCAPE_WIDTH,
        height: A4_LANDSCAPE_HEIGHT,
      });

      // Build HTML with absolutely positioned elements based on fabric objects
      const html = this.buildCertificateHTML(
        fabricData,
        backgroundUrl,
        placeholders,
      );

      await page.setContent(html, { waitUntil: 'networkidle0' });

      // Generate PDF — single page, no extra margins
      const pdfBuffer = await page.pdf({
        width: `${A4_LANDSCAPE_WIDTH}px`,
        height: `${A4_LANDSCAPE_HEIGHT}px`,
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        pageRanges: '1',
      });

      return Buffer.from(pdfBuffer);
    } catch (error) {
      this.logger.error('PDF generation failed', error);
      throw error;
    } finally {
      await page.close();
    }
  }

  /**
   * Build HTML from fabric.js canvas JSON.
   * Maps designer canvas coordinates → A4 landscape via CSS transform.
   */
  private buildCertificateHTML(
    fabricData: any,
    backgroundUrl: string | null,
    placeholders: Record<string, string>,
  ): string {
    const objects = fabricData.objects || [];
    const canvasWidth = fabricData.width || 800;
    const canvasHeight = fabricData.height || 600;

    // Calculate scale to fit canvas into A4 landscape page
    const scaleX = A4_LANDSCAPE_WIDTH / canvasWidth;
    const scaleY = A4_LANDSCAPE_HEIGHT / canvasHeight;

    let elementsHTML = '';

    // Render each fabric object
    for (const obj of objects) {
      if (
        obj.type === 'text' ||
        obj.type === 'i-text' ||
        obj.type === 'textbox'
      ) {
        let text = obj.text || '';

        // Replace placeholders
        for (const [key, value] of Object.entries(placeholders)) {
          text = text.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'gi'), value);
        }

        elementsHTML += `
          <div style="
            position: absolute;
            left: ${obj.left || 0}px;
            top: ${obj.top || 0}px;
            font-size: ${obj.fontSize || 16}px;
            font-family: ${obj.fontFamily || 'Arial'}, sans-serif;
            font-weight: ${obj.fontWeight || 'normal'};
            font-style: ${obj.fontStyle || 'normal'};
            color: ${obj.fill || '#000000'};
            text-align: ${obj.textAlign || 'left'};
            ${obj.width ? `width: ${obj.width}px;` : ''}
            transform-origin: ${obj.originX || 'left'} ${obj.originY || 'top'};
            transform: rotate(${obj.angle || 0}deg) scale(${obj.scaleX || 1}, ${obj.scaleY || 1});
            opacity: ${obj.opacity !== undefined ? obj.opacity : 1};
            white-space: pre-wrap;
          ">
            ${this.escapeHTML(text)}
          </div>
        `;
      } else if (obj.type === 'image') {
        elementsHTML += `
          <img
            src="${obj.src || ''}"
            style="
              position: absolute;
              left: ${obj.left || 0}px;
              top: ${obj.top || 0}px;
              width: ${obj.width || 100}px;
              height: ${obj.height || 100}px;
              transform-origin: ${obj.originX || 'left'} ${obj.originY || 'top'};
              transform: rotate(${obj.angle || 0}deg) scale(${obj.scaleX || 1}, ${obj.scaleY || 1});
              opacity: ${obj.opacity !== undefined ? obj.opacity : 1};
            "
          />
        `;
      }
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            @page {
              size: ${A4_LANDSCAPE_WIDTH}px ${A4_LANDSCAPE_HEIGHT}px;
              margin: 0;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            html, body {
              width: ${A4_LANDSCAPE_WIDTH}px;
              height: ${A4_LANDSCAPE_HEIGHT}px;
              overflow: hidden;
            }
            body {
              position: relative;
              ${backgroundUrl ? `background-image: url('${backgroundUrl}');` : 'background-color: #ffffff;'}
              background-size: cover;
              background-position: center;
            }
            .canvas-layer {
              position: absolute;
              top: 0;
              left: 0;
              width: ${canvasWidth}px;
              height: ${canvasHeight}px;
              transform: scale(${scaleX}, ${scaleY});
              transform-origin: top left;
            }
          </style>
        </head>
        <body>
          <div class="canvas-layer">
            ${elementsHTML}
          </div>
        </body>
      </html>
    `;
  }

  private escapeHTML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\n/g, '<br>');
  }
}
