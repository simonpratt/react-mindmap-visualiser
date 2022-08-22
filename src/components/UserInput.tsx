import { useCallback, useEffect, useRef } from 'react';
import { MOUSE_MOVE_CLICK_THRESHOLD } from '../constants/render.constants';

export interface ClickModifiers {
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
}

export interface UserInputProps {
  onClick?: (x: number, y: number, modifiers: ClickModifiers) => void;
  onRightClick?: (x: number, y: number, modifiers: ClickModifiers) => void;
  onPan?: (deltaX: number, deltaY: number) => void;
  onScroll?: (deltaX: number, deltaY: number) => void;
  onScale?: (deltaScale: number) => void;
}

interface MouseCoords {
  x: number;
  y: number;
}

const UserInput = ({ onClick, onRightClick, onPan, onScroll, onScale }: UserInputProps) => {
  const mouseLastSeen = useRef<MouseCoords>();
  const mouseFirstSeen = useRef<MouseCoords>();
  const controlPressed = useRef<boolean>(false);
  const mouseDown = useRef<boolean>();

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!mouseFirstSeen.current || !onClick) {
        return;
      }

      // Check the delta in coors between the down and up to see if we've moved or should handle it as a click
      const deltaX = Math.abs(e.x - mouseFirstSeen.current.x);
      const deltaY = Math.abs(e.y - mouseFirstSeen.current.y);
      if (deltaX > MOUSE_MOVE_CLICK_THRESHOLD || deltaY > MOUSE_MOVE_CLICK_THRESHOLD) {
        return;
      }

      onClick(e.x, e.y, { altKey: e.altKey, ctrlKey: e.ctrlKey, metaKey: e.metaKey });
    },
    [onClick],
  );

  const handleScale = useCallback(
    (e: WheelEvent) => {
      if (!onScale) {
        return;
      }
      e.preventDefault();

      onScale(e.deltaY);
    },
    [onScale],
  );

  const handleScroll = useCallback(
    (e: WheelEvent) => {
      if (!onScroll) {
        return;
      }
      onScroll(e.deltaX, e.deltaY);
    },
    [onScroll],
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      controlPressed.current ? handleScale(e) : handleScroll(e);
    },
    [handleScale, handleScroll],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!mouseDown.current || !onPan) {
        return;
      }

      const lastSeen = mouseLastSeen.current || { x: 0, y: 0 };

      const xDiff = e.x - lastSeen.x;
      const yDiff = e.y - lastSeen.y;

      mouseLastSeen.current = {
        x: e.x,
        y: e.y,
      };

      onPan(xDiff, yDiff);
    },
    [onPan],
  );

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp]);

  useEffect(() => {
    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  /**
   * Track which keys are pressed
   */
  useEffect(() => {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Meta' || e.key === 'Control') {
        controlPressed.current = true;
      }
    });

    window.addEventListener('keyup', (e: KeyboardEvent) => {
      if (e.key === 'Meta' || e.key === 'Control') {
        controlPressed.current = false;
      }
    });
  }, []);

  /**
   * Track mouse coordinate and mouse down state
   */
  useEffect(() => {
    window.addEventListener('mousedown', (e: MouseEvent) => {
      mouseFirstSeen.current = {
        x: e.x,
        y: e.y,
      };

      mouseLastSeen.current = {
        x: e.x,
        y: e.y,
      };

      mouseDown.current = true;
    });

    window.addEventListener('mouseout', () => {
      mouseDown.current = false;
    });

    window.addEventListener('mouseup', () => {
      mouseDown.current = false;
    });
  }, []);

  return null;
};

export default UserInput;
