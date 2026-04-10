import UnitInput, {
    LabeledUnitInput,
} from 'modules/Shared/settings-components/UnitInput';
import { SchemaEditor } from '../../modules/setting-components/SchemaEditor';
import { BorderRadius } from 'modules/setting-components/BorderRadius';
import { ColorComponent } from 'modules/setting-components/ColorComponent';
import { FontSpaceLH } from 'modules/setting-components/FontSpaceLH';
import { MinMax } from 'modules/setting-components/MinMax';
import { GlobalSavedColors } from 'modules/setting-components/GlobalSavedColors';
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
    RichTextCMS,
    SelectInput as Select,
} from '../../modules/setting-components/Select';
import { Border, Tabs } from '../../modules/setting-components/Tabs';
import { ColumnSize } from 'modules/setting-components/ColumnSize';
import {
    CustomFonts,
    FontUpload,
    GoogleFonts,
} from 'modules/setting-components/Fonts';
import { HelpText } from 'modules/setting-components/HelpText';
import { PageVisibility } from 'modules/setting-components/PageVisibility';
import SelectField from './SelectField';
import { WebhookHelp } from 'modules/setting-components/WebhookHelp';
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
    ColumnSize,
    FontSpaceLH,
    MinMax,
    // ListElement,
    CustomFonts,
    GoogleFonts,
    WebhookHelp,
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
    PageVisibility,
    ContainerSize,
    WidthModeSelector,
    ColorPicker: ColorComponent,
    SortSelector,
};
