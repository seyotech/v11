import React from 'react';
import { render } from 'util/test-utils';
import { InteractiveComponent } from './InteractiveComponent';
import htmlEscape from 'lodash/escape';

describe('InteractiveComponent', () => {
    it('should escape a single HTML string', () => {
        const inputString = '<a>asasasasas</a>';
        const escapedString = htmlEscape(inputString);

        const { container } = render(
            <InteractiveComponent strings={[inputString]} />
        );

        expect(container.innerHTML).toContain(escapedString);
    });

    it('should escape multiple HTML strings', () => {
        const inputStrings = ['<div>Hello</div>', 'world'];
        const escapedStrings = inputStrings.map((str) => htmlEscape(str));

        const { container } = render(
            <InteractiveComponent strings={inputStrings} />
        );

        escapedStrings.forEach((escapedString) => {
            expect(container.innerHTML).toContain(escapedString);
        });
    });

    it('should render empty string if input is empty', () => {
        const { container } = render(<InteractiveComponent strings={['']} />);

        expect(container.innerHTML).toContain('');
    });
});
