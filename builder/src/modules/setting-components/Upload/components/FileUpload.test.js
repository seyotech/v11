/* eslint-disable testing-library/await-async-utils */
/*****************************************************
 * Packages
 ******************************************************/

/*****************************************************
 * Locals
 ******************************************************/
import useManageMedia from 'hooks/media-library/useManageMedia';
import { getByCustomSelector } from 'util/custom-queries';
import {
    fireEvent,
    initFakeTimer,
    render,
    screen,
    waitFakeTimer,
    waitFor,
} from 'util/test-utils';
import ucFirst from 'util/ucFirst';
import { expect, vi } from 'vitest';
import FileUpload from './FileUpload';
import { entityTypeEnum } from 'constants/mediaEntityTypeEnum';

/*****************************************************
 * Mock functionality
 ******************************************************/
const mockWriteText = vi.fn();
const mockOnSuccess = vi.fn();
const mockOnSearch = vi.fn();
const mockFetchNextPage = vi.fn();
const mockHandleDeleteMedia = vi.fn();
const mockHandleMedia = vi.fn(() => [{ path: 'test-path' }]);
const mockOnChange = vi.fn();

/*****************************************************
 * Stub functionality
 ******************************************************/
class IntersectionObserverMock {
    constructor(callback) {
        this.callback = callback;
    }
    observe() {
        this.callback([{ isIntersecting: true }]); // Simulate intersection happening
    }
    unobserve() {}
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
vi.stubGlobal('navigator', {
    clipboard: {
        writeText: mockWriteText,
    },
});

/*****************************************************
 * Mock data
 ******************************************************/
const dummyRootCDN = 'https://dummy.com';
const initialCtx = {
    user: { id: '1234' },
    useMedia: vi.fn(() => ({})),
    CDNDomain: dummyRootCDN,
    currentEditItem: {},
    type: 'image',
    accept: 'image/jpeg, image/png, image/svg+xml, image/webp',
    size: 6,
    handleUploadMedia: mockHandleMedia,
    onSuccess: vi.fn(),
    fetchNextPage: vi.fn(),
    media: { data: [] },
};

const defaultProps = {
    accept: 'image/jpeg, image/png, image/svg+xml, image/webp',
    onSuccess: () => {},
    run: true,
    size: 6,
    type: 'image',
    label: 'Test Label',
    onChange: mockOnChange,
};

const mockImage = {
    name: 'image.png',
    path: 'dummy-path-image.png',
    kind: 'image',
    id: 'xyz',
};
const mockVideo = {
    name: 'video-1.mp4',
    path: 'dummy-path-video.mp4',
    kind: 'video',
    id: 'xyz',
};

vi.mock('../../../../hooks/media-library/useManageMedia', async () => {
    return {
        default: vi.fn(() => ({
            ...initialCtx,
            ...defaultProps,
        })),
    };
});

// const renderWithFileUploadContextProvider = ({
//     shortContext,
//     ...restProps
// } = {}) =>
//     render(
//         <FileUploadContextProvider value={{ ...initialCtx, ...shortContext }}>
//             <FileUpload {...{ ...defaultProps, ...restProps }} />
//         </FileUploadContextProvider>,
//         {
//             shortContext: { ...initialCtx, ...shortContext },
//         }
//     );

/*****************************************************
 * Tests
 ******************************************************/
describe('File Upload', () => {
    initFakeTimer();
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render FileUpload component with image with default entityType', async () => {
        render(<FileUpload {...defaultProps} />, {
            shortContext: { ...initialCtx },
        });

        const label = screen.getByText(defaultProps.label);
        expect(label).toBeInTheDocument();

        const uploadButton = screen.getByText('Upload Image');
        // open medial
        expect(uploadButton).toBeInTheDocument();
        await fireEvent.click(uploadButton);

        // switch to upload tab
        const uploadTab = screen.getByRole('tab', { name: 'Upload Image' });
        await fireEvent.click(uploadTab);

        const uploadArea = screen.getByText('Drag or Click to Upload Media');

        expect(uploadArea).toBeInTheDocument();

        // handle png file
        let files = [{ file: 'foo.png', type: 'image/png' }];
        await fireEvent.change(
            getByCustomSelector('.ant-upload-wrapper input'),
            {
                target: { files },
            }
        );

        expect(mockHandleMedia).toHaveBeenCalledWith({
            fileList: files.map(expect.objectContaining),
            kind: 'image',
            entityType: entityTypeEnum.REGULAR,
        });

        // handle jpeg files
        files = [{ file: 'bar.jpeg', type: 'image/jpeg' }];
        await fireEvent.change(
            getByCustomSelector('.ant-upload-wrapper input'),
            {
                target: { files },
            }
        );

        expect(mockHandleMedia).toHaveBeenCalledWith({
            fileList: files.map(expect.objectContaining),
            kind: 'image',
            entityType: entityTypeEnum.REGULAR,
        });

        // handle unknown file
        files = [{ file: 'baz.unknown', type: 'image/unknown' }];

        await fireEvent.change(
            getByCustomSelector('.ant-upload-wrapper input'),
            {
                target: { files },
            }
        );

        // not to have been called
        expect(mockHandleMedia).not.toHaveBeenCalledTimes(3);

        // handle file size validation
        files = [
            { file: 'baz.png', type: 'image/png', size: 8 * (1024 * 1024) },
        ];

        await fireEvent.change(
            getByCustomSelector('.ant-upload-wrapper input'),
            {
                target: { files },
            }
        );

        await waitFakeTimer();

        const errorMessage = await screen.findByText(
            'We accept highest 6MB image file'
        );
        expect(errorMessage).toBeInTheDocument();
    });

    it('should render FileUpload component with video with default entityType', async () => {
        const videoProps = {
            type: 'video',
            accept: 'video/mp4, video/webm, video/mpeg, video/flv, video/mkv',
        };

        render(<FileUpload {...defaultProps} {...videoProps} />, {
            shortContext: { ...initialCtx, ...videoProps },
        });

        const label = screen.getByText(defaultProps.label);
        expect(label).toBeInTheDocument();

        const uploadButton = screen.getByText(`Upload Video`);
        expect(uploadButton).toBeInTheDocument();

        fireEvent.click(uploadButton);

        // switch to upload tab
        const uploadTab = screen.getByRole('tab', { name: 'Upload Video' });
        await fireEvent.click(uploadTab);

        const uploadArea = screen.getByText('Drag or Click to Upload Media');

        expect(uploadArea).toBeInTheDocument();

        // handle mp4 file
        let files = [{ file: 'foo.mp4', type: 'video/mp4' }];
        await fireEvent.change(
            getByCustomSelector('.ant-upload-wrapper input'),
            {
                target: { files },
            }
        );

        expect(mockHandleMedia).toHaveBeenCalledWith({
            fileList: files.map(expect.objectContaining),
            kind: videoProps.type,
            entityType: entityTypeEnum.REGULAR,
        });

        // handle webm files
        files = [{ file: 'bar.webm', type: 'video/webm' }];
        await fireEvent.change(
            getByCustomSelector('.ant-upload-wrapper input'),
            {
                target: { files },
            }
        );

        expect(mockHandleMedia).toHaveBeenCalledWith({
            fileList: files.map(expect.objectContaining),
            kind: videoProps.type,
            entityType: entityTypeEnum.REGULAR,
        });

        // handle unknown file
        files = [{ file: 'baz.unknown', type: 'video/unknown' }];

        await fireEvent.change(
            getByCustomSelector('.ant-upload-wrapper input'),
            {
                target: { files },
            }
        );

        // not to have been called
        expect(mockHandleMedia).not.toHaveBeenCalledTimes(3);

        // handle file size validation
        files = [
            { file: 'baz.mp4', type: 'video/mp4', size: 8 * (1024 * 1024) },
        ];

        await fireEvent.change(
            getByCustomSelector('.ant-upload-wrapper input'),
            {
                target: { files },
            }
        );

        await waitFakeTimer();

        const errorMessage = screen.getByText(
            'We accept highest 6MB video file'
        );
        expect(errorMessage).toBeInTheDocument();
    });

    it.each([mockImage, mockVideo])(
        'should all functionality work for $kind',
        async (file) => {
            const { name, kind, path, id } = file;
            const props = {
                type: kind,
                onChange: mockOnChange,
                name,
            };

            const data = [file];
            const ctx = {
                onSuccess: mockOnSuccess,
                handleDeleteMedia: mockHandleDeleteMedia,
                media: {
                    data,
                    hasNextPage: vi.fn(),
                },
                fetchNextPage: mockFetchNextPage,
                searchMedia: mockOnSearch,
            };

            useManageMedia.mockReturnValue({ ...initialCtx, ...ctx, ...props });
            render(<FileUpload {...defaultProps} {...props} />, {
                shortContext: { ...initialCtx, ...ctx, ...props },
            });

            // open modal
            const uploadButton = screen.getByText(`Upload ${ucFirst(kind)}`);
            fireEvent.click(uploadButton);

            // switch to image/video tab
            const mediaTab = screen.getByText(`${ucFirst(kind)} Library`);
            fireEvent.click(mediaTab);

            // hover over the image/video
            const card = screen.getByTestId(name);
            fireEvent.mouseOver(card);

            // test use functionality
            const useButton = screen.getByRole('button', { name: 'Insert' });
            fireEvent.click(useButton);
            expect(mockOnChange).toBeCalled();

            // test delete functionality
            const deleteButton = screen.getByTestId('media-remove');
            fireEvent.click(deleteButton);

            const confirmPopup = screen.getByText(
                `Are you sure to delete this ${kind}`
            );
            expect(confirmPopup).toBeInTheDocument();

            const yesButton = screen.getByRole('button', { name: 'Yes' });
            fireEvent.click(yesButton);
            expect(mockHandleDeleteMedia).toHaveBeenLastCalledWith({
                id,
                kind,
            });

            // test copy functionality
            const copyLink = screen.getByTestId('media-link');
            fireEvent.click(copyLink);
            expect(mockWriteText).toHaveBeenLastCalledWith(
                `${dummyRootCDN}/${path}`
            );

            const searchInput = screen.getByPlaceholderText(/search/gi);
            const searchTerm = 'test';

            // test search functionality
            await fireEvent.change(searchInput, {
                target: { value: searchTerm },
            });

            await waitFakeTimer();
            expect(mockOnSearch).toHaveBeenCalledWith(
                expect.objectContaining({
                    event: expect.objectContaining({
                        target: expect.objectContaining({ value: searchTerm }),
                    }),
                    entityType: 'regular',
                })
            );
        }
    );

    it.each(['image', 'video'])(
        'should handle loading and empty data for %s',
        async (kind) => {
            const props = {
                type: kind,
            };

            const ctx = {
                media: {
                    data: [],
                },
                fetchNextPage: vi.fn(),
            };

            const { rerender } = render(
                <FileUpload {...defaultProps} {...props} />,
                { shortContext: { ...initialCtx, ...ctx, ...props } }
            );

            // switch to image/video tab;
            const uploadButton = await screen.findByText(
                `Upload ${ucFirst(props.type)}`
            );
            fireEvent.click(uploadButton);
            const tab = screen.getByText(`${ucFirst(kind)} Library`);
            fireEvent.click(tab);

            // empty data
            waitFor(() => {
                expect(
                    screen.getByText(`No ${ucFirst(kind)} Found`)
                ).toBeInTheDocument();
            });
            rerender(<FileUpload {...defaultProps} {...props} />, {
                shortContext: {
                    ...initialCtx,
                    ...ctx,
                    ...props,
                    isLoading: true,
                },
            });

            // loading indicator
            const loadingSpinner = getByCustomSelector('.ant-spin-spinning');
            waitFor(() => {
                expect(loadingSpinner).toBeInTheDocument();
            });
        }
    );

    it.each([mockImage, mockVideo])(
        'should show preview of $kind with prefilled value ($path) in input field',
        async (file) => {
            const props = {
                type: file.kind,
                value: file.path,
            };

            render(
                <FileUpload
                    {...defaultProps}
                    onChange={mockOnChange}
                    {...props}
                />,
                {
                    shortContext: {
                        ...initialCtx,
                        ...props,
                        media: { data: [file] },
                    },
                }
            );

            // should not render upload button
            let uploadButton = screen.queryByText(
                `Upload ${ucFirst(props.type)}`
            );
            expect(uploadButton).not.toBeInTheDocument();

            const tag = file.kind === 'image' ? 'img' : 'video';
            const extension = file.kind === 'image' ? 'png' : 'mp4';

            // preview
            const preview = getByCustomSelector(
                `${tag}[src="${dummyRootCDN}/${file.path}"]`
            );
            expect(preview).toBeInTheDocument();

            // prefilled input field
            const input = getByCustomSelector(
                `input[value="${dummyRootCDN}/${file.path}"]`
            );
            expect(input).toBeInTheDocument();

            // check onChange functionality
            const value = `https://test-file.${extension}`;
            await fireEvent.change(input, {
                target: {
                    value,
                },
            });

            expect(mockOnChange).toHaveBeenCalledWith(
                expect.objectContaining({ value })
            );

            // check delete functionality
            fireEvent.mouseOver(preview);

            const deleteButton = screen.getByTestId('remove-preview');

            fireEvent.click(deleteButton);
            const yesButton = screen.getByRole('button', { name: 'Yes' });
            fireEvent.click(yesButton);

            await waitFakeTimer();
            expect(mockOnChange).toHaveBeenCalledWith(
                expect.objectContaining({ value: '' })
            );

            // check replace functionality
            fireEvent.mouseOver(preview);

            const previewButton = screen.getByText(
                `Replace ${ucFirst(file.kind)}`
            );

            fireEvent.click(previewButton);

            // switch to upload tab
            uploadButton = screen.queryByText(`Upload ${ucFirst(props.type)}`);
            await fireEvent.click(uploadButton);

            const uploadArea = screen.getByText(
                'Drag or Click to Upload Media'
            );
            expect(uploadArea).toBeInTheDocument();
            // If the draggable area is visible, it should work as expected.
        }
    );

    it.each(Object.values(entityTypeEnum))(
        'should upload and search with prop entityType %s',
        async (entityType) => {
            render(<FileUpload {...defaultProps} entityType={entityType} />, {
                shortContext: { ...initialCtx },
            });

            const uploadButton = screen.getByText('Upload Image');
            expect(uploadButton).toBeInTheDocument();
            await fireEvent.click(uploadButton);

            const uploadTab = screen.getByRole('tab', { name: 'Upload Image' });
            await fireEvent.click(uploadTab);

            let files = [{ file: 'foo.png', type: 'image/png' }];
            await fireEvent.change(
                getByCustomSelector('.ant-upload-wrapper input'),
                {
                    target: { files },
                }
            );

            expect(mockHandleMedia).toHaveBeenCalledWith({
                fileList: files.map(expect.objectContaining),
                kind: 'image',
                entityType: entityType,
            });
        }
    );

    it('should FetchNextPage be called correctly with entityType', async () => {
        const data = Array.from({ length: 50 }, (_, index) => mockImage);
        const ctx = {
            onSuccess: () => {},
            handleDeleteMedia: () => {},
            media: {
                data,
                hasNextPage: vi.fn(),
            },
            fetchNextPage: mockFetchNextPage,
            searchMedia: () => {},
        };

        useManageMedia.mockReturnValue({ ...initialCtx, ...ctx });
        render(<FileUpload {...defaultProps} />, {
            shortContext: { ...initialCtx, ...ctx },
        });

        // open modal
        const uploadButton = screen.getByText(`Upload Image`);
        await fireEvent.click(uploadButton);

        // switch to image tab
        const mediaTab = screen.getByText(`Image Library`);
        await fireEvent.click(mediaTab);

        expect(mockFetchNextPage).toHaveBeenCalledWith({
            kind: 'image',
            entityType: entityTypeEnum.REGULAR,
        });
    });
});
