import sectionFrames from 'components/editor-resources/section-frames';
import { fireEvent, render, screen } from 'util/test-utils';
import { Frames } from './Frames';

describe('Frames', () => {
    it.each(['top', 'bottom', 'corner'])(
        'should render component with position (%s) properly',
        (position) => {
            const onSelect = vi.fn();

            const frameData = sectionFrames.filter(
                (frame) => frame.position === position
            );

            const [
                { id: emptyFrameId },
                { id: activeFrameId },
                { id: regularFrameId },
            ] = frameData;

            render(
                <Frames
                    position={position}
                    onSelect={onSelect}
                    frameId={activeFrameId}
                />
            );

            // Verify that the component renders the correct number of frames
            const frames = screen.getAllByTestId(/frame/i);
            expect(frames.length).toBe(frameData.length);

            // Verify that the active frame has the correct className
            const activeFrame = screen.getByTestId(`frame-${activeFrameId}`);
            expect(activeFrame).toHaveClass('active');

            const regularFrame = screen.getByTestId(`frame-${regularFrameId}`);
            expect(regularFrame).not.toHaveClass('active');

            // Verify that the frame onClick event does not triggers the onSelect function on activeFrame
            fireEvent.click(activeFrame);
            expect(onSelect).not.toHaveBeenCalled();

            // Verify that the frame onClick event triggers the onSelect function on regularFrame
            fireEvent.click(regularFrame);
            expect(onSelect).toHaveBeenCalledWith({
                name: 'frameId',
                value: regularFrameId,
            });

            // Verify that the frame onClick event triggers the onSelect function emptyFrame
            const emptyFrame = screen.getByTestId(`frame-${emptyFrameId}`);

            fireEvent.click(emptyFrame);
            expect(onSelect).toHaveBeenCalledWith({
                name: 'frameId',
                value: emptyFrameId,
            });
        }
    );

    it('should render component with invalid position prop', () => {
        const onSelect = vi.fn();
        const frameId = 1;

        render(
            <Frames position="invalid" onSelect={onSelect} frameId={frameId} />
        );

        // Verify that the component does not render any frames
        const frames = screen.queryAllByTestId(/frame/i);
        expect(frames.length).toBe(0);
    });
});
