# Kumbukum Screenshot Service

Screenshot service using Puppeteer and Chromium, running in a Docker container. Provides an HTTP API for generating screenshots on demand.

Used by [razuna.com](https://razuna.com) and [kumbukum.com](https://kumbukum.com) for generating screenshots.

## Example usage:

```
curl -X POST http://screenshot \
	-H "Content-Type: application/json" \
    -d '{"url": "https://razuna.com", "fullPage": false, "quality": 60 }' \
    --output screenshot60.jpg
```

## Example usage with custom dimensions:

```
curl -X POST http://screenshot \
	-H "Content-Type: application/json" \
    -d '{"url": "https://razuna.com", "fullPage": false, "quality": 60, "width": 800, "height": 600 }' \
    --output screenshot60.jpg
```

## Options with default values:

- `url` (string, required): The URL of the webpage to capture.
- `width` (number, default: 1440): The width of the viewport for the screenshot.
- `height` (number, default: 900): The height of the viewport for the screenshot.
- `fullPage` (boolean, default: false): Whether to capture the entire page or just the visible viewport.
- `format` (string, default: "jpg"): The image format for the screenshot (e.g., "jpg", "png").
- `quality` (number, default: 60): The quality of the screenshot (0-100) for lossy formats like JPEG.
- `delay` (number, default: 100): The delay in milliseconds before taking the screenshot, allowing time for dynamic content to load.

## About user agents:

We use a random user agent for each screenshot to mimic real browser behavior and avoid detection by websites. This helps ensure that we can capture screenshots of pages that might block requests from known bots or headless browsers.


