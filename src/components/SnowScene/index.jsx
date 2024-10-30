import { useEffect, useRef } from 'react';

export const SnowScene = () => {
  const canvasRef = useRef(null);
  const snowHeapRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      snowHeapRef.current = new Array(Math.ceil(canvas.width / 2)).fill(canvas.height);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    const snowflakes = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      speed: Math.random() * 1 + 0.5,
      opacity: Math.random() * 0.5 + 0.5
    }));

    let animationFrame;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw accumulated snow
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);

      for (let i = 0; i < snowHeapRef.current.length; i++) {
        ctx.lineTo(i * 2, snowHeapRef.current[i]);
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fill();

      snowflakes.forEach(flake => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        ctx.fill();

        flake.y += flake.speed;
        flake.x += Math.sin(flake.y * 0.01) * 0.5;

        const heapIndex = Math.floor(flake.x / 2);
        if (heapIndex >= 0 && heapIndex < snowHeapRef.current.length) {
          if (flake.y + flake.radius >= snowHeapRef.current[heapIndex]) {
            const impact = flake.radius * 2;
            for (let i = Math.max(0, heapIndex - 2); i < Math.min(snowHeapRef.current.length, heapIndex + 3); i++) {
              snowHeapRef.current[i] = Math.max(
                0,
                Math.min(
                  snowHeapRef.current[i] - impact * Math.max(0, 1 - Math.abs(i - heapIndex) / 2),
                  canvas.height
                )
              );
            }

            flake.y = -flake.radius;
            flake.x = Math.random() * canvas.width;
          }
        }

        if (flake.y - flake.radius > canvas.height) {
          flake.y = -flake.radius;
          flake.x = Math.random() * canvas.width;
        }
      });

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="absolute w-full h-full bg-gradient-to-b from-blue-900 to-blue-800 rounded-xl overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
