import { TestWindow } from '@stencil/core/dist/testing';
import { ImageGallery } from './image-gallery';

describe('my-component', () => {
  it('should build', () => {
    expect(new ImageGallery()).toBeTruthy();
  });

  describe('rendering', () => {
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      await testWindow.load({
        components: [ImageGallery],
        html: '<image-gallery></image-gallery>'
      });
    });
  });
});
