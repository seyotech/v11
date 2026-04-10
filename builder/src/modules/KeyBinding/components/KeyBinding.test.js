import { beforeEach } from 'vitest';
import { KeyBinding } from './KeyBinding';
import { fireEvent, render, waitFor } from '../../../util/test-utils';

const mockHandleUndo = vi.fn();
const mockHandleRedo = vi.fn();
const mockHandleSaveData = vi.fn();
const mockShowSettingsModal = vi.fn();
const mockHandleShowPublishPopOver = vi.fn();
const context = {
    elementContext: {
        handleUndo: mockHandleUndo,
        handleRedo: mockHandleRedo,
        handleSaveData: mockHandleSaveData,
        showSettingsModal: mockShowSettingsModal,
        handleShowPublishPopOver: mockHandleShowPublishPopOver,
    },
};

const events = [
    {
        key: 'p',
        code: 'KeyP',
        keyCode: 80,
        shiftKey: true,
        metaKey: true,
        name: 'publish',
        handler: mockHandleShowPublishPopOver,
    },
    {
        key: 'z',
        code: 'KeyZ',
        metaKey: true,
        name: 'undo',
        handler: mockHandleUndo,
    },
    {
        key: 'z',
        code: 'KeyZ',
        metaKey: true,
        shiftKey: true,
        name: 'redo',
        handler: mockHandleRedo,
    },
    {
        key: 's',
        code: 'KeyS',
        metaKey: true,
        name: 'publish',
        handler: mockHandleSaveData,
    },
    {
        key: '/',
        code: 'Slash',
        metaKey: true,
        shiftKey: true,
        name: 'show',
        handler: mockShowSettingsModal,
    },
];
describe('KeyBinding component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        document.addEventListener('PUBLISH', mockHandleShowPublishPopOver);
        document.addEventListener('SAVE', mockHandleSaveData);
        document.addEventListener('UNDO', mockHandleUndo);
        document.addEventListener('REDO', mockHandleRedo);
        document.addEventListener('SHOW', mockShowSettingsModal);
    });
    test.each(events)(
        '$handler should call fn properly for $name keybinding',
        async ({ name, handler, ...eventObj }) => {
            render(<KeyBinding />, context);
            fireEvent.keyDown(document, eventObj);
            await waitFor(() => {
                expect(handler).toHaveBeenCalledTimes(1);
            });
        }
    );
});
