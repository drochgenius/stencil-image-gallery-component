import { Component, Element, Prop } from '@stencil/core';

const DEFAULT_DELAY: number = 2000;
const DEFAULT_STAGE_WIDTH: string = '640px';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      slot: JSXElements.SlotAttributes;
    }
  }
  namespace JSXElements {
    interface SlotAttributes {
      name?: string;
      onSlotchange?: any;
    }
  }
}

@Component({
  tag: 'image-gallery',
  styleUrl: 'image-gallery.css',
  shadow: true
})
export class ImageGallery {
  @Prop() autoPlay: boolean;
  @Prop({ mutable: true })
  count: number;
  @Prop({ mutable: true })
  position: number = 0;
  @Prop() activityTitle: string;

  @Element() imageGalleryEl: HTMLElement;

  private interval: NodeJS.Timer;

  public get stageWidth(): string {
    return getComputedStyle(this.imageGalleryEl).getPropertyValue('--stage-width') || DEFAULT_STAGE_WIDTH;
  }

  public get styles(): string {
    return `.carousel { margin-left: ${-this.position * parseInt(this.stageWidth)}px; }`;
  }

  public pause(): void {
    clearInterval(this.interval);
  }

  public next(): ImageGallery {
    this.position = (this.position + 1) % this.count;
    return this;
  }

  public prev(): ImageGallery {
    this.position = (this.count + (this.position - 1)) % this.count;
    return this;
  }

  public goto(position: number = 0): void {
    if (Math.abs(position) > this.count) {
      position = 0;
    }

    if (position >= 0) {
      this.position = position % this.count;
    } else {
      this.position = (this.count + position) % this.count;
    }
  }

  /**
   * Play the slideshow, switching automatically after the specified delay
   *
   * @param delay : time to wait before switching to the next slide
   * @param reverse : reverse playback direction
   */
  public play(delay: number = DEFAULT_DELAY, reverse: boolean = false): void {
    this.pause();
    this.interval = setInterval(() => (reverse ? this.prev() : this.next()), delay);
  }

  public componentDidLoad(): void {
    if (this.autoPlay) {
      this.play();
    }
  }

  public render() {
    const posIndex: number = this.position + 1;

    return (
      <main>
        <style>{this.styles}</style>
        <h3>{this.activityTitle}</h3>
        <section class="stage">
          <div class="carousel">
            <slot name="items" onSlotchange={(event: UIEvent) => this.slotChanged(event)} />
          </div>
        </section>
        <nav>
          <button class="mdc-button" disabled={this.position <= 0} onClick={() => this.prev()}>
            previous
          </button>
          <span>
            {posIndex} of {this.count}
          </span>
          <button class="mdc-button" disabled={this.position >= this.count - 1} onClick={() => this.next()}>
            next
          </button>
        </nav>
      </main>
    );
  }

  /**
   * Update the UI whenever nodes are added or removed from the slot
   *
   * @param event
   */
  private slotChanged(event: UIEvent): void {
    const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
    if (slot) {
      const nodes: Node[] = slot.assignedNodes();
      if (nodes) {
        this.count = nodes.length;
        for (const el of nodes as HTMLElement[]) {
          el.removeAttribute('hidden');
          const img: HTMLImageElement = el.querySelector('img');
          if (img) {
            el.querySelector('img').style.height = 'inherit';
          }
        }
      }
    }
  }
}
