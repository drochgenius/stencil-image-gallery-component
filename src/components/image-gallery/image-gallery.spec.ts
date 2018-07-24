import { TestWindow } from '@stencil/core/dist/testing';
import { ImageGallery } from './image-gallery';

describe('my-component', () => {
  it('should build', () => {
    expect(new ImageGallery()).toBeTruthy();
  });

  describe('rendering', () => {
    let element: HTMLImageGalleryElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [ImageGallery],
        html: '<my-component></my-component>'
      });
    });

    it('should work without parameters', () => {
      expect(element.textContent.trim()).toEqual('Hello, World! I\'m');
    });

  });
});
