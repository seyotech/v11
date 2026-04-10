export default class SettingsTab {
    constructor(obj) {
        this.icon = obj.icon;
        this.title = obj.title;
        this.content = obj.content;
    }

    getContentByType(type) {
        if (this.content) {
            const settingGroupsByType = this.content[type] || [];

            if (type === 'default' && settingGroupsByType.length)
                return settingGroupsByType;

            return settingGroupsByType.concat(this.content.default);
        } else {
            return [];
        }
    }
}
