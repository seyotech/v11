import UnitInput, {
    LabeledUnitInput,
} from 'modules/Shared/settings-components/UnitInput';
import { SchemaEditor } from '../../modules/setting-components/SchemaEditor';
import { BorderRadius } from 'modules/setting-components/BorderRadius';
import { ColorComponent } from 'modules/setting-components/ColorComponent';
import { FontSpaceLH } from 'modules/setting-components/FontSpaceLH';
import { MinMax } from 'modules/setting-components/MinMax';
import { Range } from 'modules/setting-components/Range';
import { Segmented } from 'modules/setting-components/Segmented';
import { SimpleBorder } from 'modules/setting-components/SimpleBorder';
import { Size } from 'modules/setting-components/Size';
import { ImagePreview } from 'modules/setting-components/Upload';
import { DataAttributes } from '../../modules/setting-components/DataAttributes';
import {
    Input,
    InputID,
    InputUrl,
    Input as PrependInput,
} from '../../modules/setting-components/Input';
import { SectionFrame } from '../../modules/setting-components/SectionFrame';
import {
    PageSelect,
    PopupRows,
    SelectInput as Select,
} from '../../modules/setting-components/Select';
import { Border, Tabs } from '../../modules/setting-components/Tabs';
import {
    CustomFonts,
    FontUpload,
    GoogleFonts,
} from 'modules/setting-components/Fonts';
import { HelpText } from 'modules/setting-components/HelpText';
import SelectField from './SelectField';
import SitemapConfig from './SitemapConfig';
import TogglePreview from './TogglePreview';
import {
    ContainerSize,
    WidthModeSelector,
} from 'modules/setting-components/ContainerSize';
import { SortSelector } from 'modules/setting-components/SortSelector';

export default {

    Segmented: Segmented,
    SelectField,
    GlobalSavedColors,
    Size,
    Input,
    Range,
    Select,
    Border,
    InputID,
    InputUrl,
    HelpText,
    // Mappable,
    PopupRows,
    Tab: Tabs,
    UnitInput,
    PageSelect,
    FontUpload,
    FontSpaceLH,
    MinMax,
    // ListElement,
    CustomFonts,
    GoogleFonts,
    SectionFrame,
    PrependInput,
    // CFInputLabel,
    BorderRadius,
    SimpleBorder,
    // SimpleMargin,
    ImagePreview,
    SitemapConfig,
    TogglePreview,
    SchemaEditor,
    DataAttributes,
    LabeledUnitInput,
    ContainerSize,
    WidthModeSelector,
    ColorPicker: ColorComponent,
    SortSelector,
};
