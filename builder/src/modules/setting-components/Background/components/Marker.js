/*****************************************************
 * Packages
 ******************************************************/
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import isEqual from 'lodash/isEqual';

/*****************************************************
 * Locals
 ******************************************************/
import { MarkerButton, MarkerDelete, Picker } from './Background.stc';

/**
 * Render a marker component.
 *
 * @param {Object} options - The options for the marker component.
 * @param {Object} options.marker - The marker object containing information about the marker.
 * @param {function} options.deleteMarker - The function to delete the marker.
 * @param {function} options.changeSelectedMarker - The function to change the selected marker.
 * @param {Object} options.selectedMarker - The currently selected marker.
 *
 * @returns {JSX.Element} - The rendered marker component.
 *
 *
 * @example
 *
 * import Marker from './Marker';
 *
 * // Marker object
 * const marker = {
 *   position: 1,
 *   color: '#ff0000',
 * };
 *
 * // Function to delete a marker
 * const deleteMarker = (position) => {
 *    // delete marker logic
 * };
 *
 * // Function to change the selected marker
 * const changeSelectedMarker = (marker) => {
 *    // change selected marker logic
 * };
 *
 * // Currently selected marker
 * const selectedMarker = {
 *   position: 2,
 *   color: '#00ff00',
 * };
 *
 * // Render the marker component
 * ReactDOM.render(
 *   <Marker
 *     marker={marker}
 *     deleteMarker={deleteMarker}
 *     changeSelectedMarker={changeSelectedMarker}
 *     selectedMarker={selectedMarker}
 *   />,
 *   document.getElementById('root')
 * );
 */
export default function Marker({
    marker,
    deleteMarker,
    changeSelectedMarker,
    selectedMarker,
}) {
    const isSelected = isEqual(selectedMarker, marker) ? true : false;

    return (
        <>
            <MarkerButton
                key={marker.position}
                color={marker.color}
                left={marker.position}
                data-testid={`marker-${marker.position}`}
                onClick={() => changeSelectedMarker(marker)}
            >
                <Picker background={marker.color} isSelected={isSelected} />

                <MarkerDelete
                    onClick={() => deleteMarker(marker.position)}
                    data-testid={`delete-marker-${marker.position}`}
                >
                    <FontAwesomeIcon icon={['far', 'times']} />
                </MarkerDelete>
            </MarkerButton>
        </>
    );
}
