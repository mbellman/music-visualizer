import Ball from 'AppCore/Visualization/Shapes/Ball';
import Bar from 'AppCore/Visualization/Shapes/Bar';
import Fill from 'AppCore/Visualization/Effects/Fill';
import Glow from 'AppCore/Visualization/Effects/Glow';
import Scroll from 'AppCore/Visualization/Effects/Scroll';
import Shape from 'AppCore/Visualization/Shapes/Shape';
import Stroke from 'AppCore/Visualization/Effects/Stroke';

export function barFactory (x: number, y: number, width: number, height: number): Shape[] {
  return [
    new Bar(x, y, width, height)
      .pipe(
        new Glow({ R: 255, G: 0, B: 255 }, 20)
          .delay(2000)
          .fadeIn(250)
          .fadeOut(500)
      )
      .pipe(new Stroke({ R: 0, G: 255, B: 255 }, 3))
      .pipe(
        new Fill({ R: 0, G: 0, B: 150 })
          .delay(2000)
      )
      .pipe(new Scroll())
  ];
}

export function ballFactory (x: number, y: number): Shape[] {
  return [
    new Ball(x, y, 10)
      .pipe(
        new Glow({ R: 255, G: 0, B: 0 }, 50)
          .delay(3000)
          .fadeOut(500)
      )
      .pipe(new Stroke({ R: 255, G: 0, B: 0}, 3))
      .pipe(
        new Fill({ R: 255, G: 200, B: 50 })
          .delay(3000)
      )
      .pipe(new Scroll())
  ];
}
