export default function makeTabs(doc) {
    const tabsList = doc.querySelectorAll('.get-tabs-options');

    if (tabsList.length) {
        let tabsClassList = [...tabsList].map(
            (item) => item.dataset.tabsWrapper
        );

        tabsClassList.forEach((tabsClass) => {
            const tabsWrapper = doc.querySelector(
                `.${tabsClass.split(' ')[0]}`
            );
            const tab = tabsWrapper.querySelector('.dorik-tabs');
            const tabsTrigger = tabsWrapper.querySelectorAll('ul li');
            const tabsPanel = tabsWrapper.querySelectorAll('.tabs-panel');
            tab.classList.add('is-initialized');
            tab.classList.add('tabs-allowed');
            const { selectedTab } =
                tabsWrapper.querySelector('.get-tabs-options').dataset;
            tabsTrigger.forEach((el, i) => {
                const tab = el.querySelector('a');
                if (!tab) return;
                if (i !== parseInt(selectedTab)) {
                    tab.classList.remove('is-selected');
                } else {
                    tab.classList.add('is-selected');
                }
            });
            tabsPanel.forEach((el, i) => {
                const content = el.querySelector('.content');
                if (!content) return;
                if (i !== parseInt(selectedTab)) {
                    el.classList.add('is-hidden');
                    content.classList.add('is-hidden');
                } else {
                    el.classList.add('is-open');
                    content.classList.add('is-open');
                }
            });

            tabsTrigger.forEach((tabTrigger) => {
                tabTrigger.addEventListener('click', function (e) {
                    tabsTrigger.forEach((el) => {
                        const tab = el.querySelector('a');
                        if (!tab) return;
                        tab.classList.remove('is-selected');
                    });
                    tabsPanel.forEach((el) => {
                        const content = el.querySelector('.content');
                        if (!content) return;
                        el.classList.remove('is-open');
                        el.classList.add('is-hidden');
                        content.classList.remove('is-open');
                        content.classList.add('is-hidden');
                    });
                    const panel = tabsWrapper.querySelector(
                        `.${e.target.dataset.panelClass}`
                    );
                    panel.classList.remove('is-hidden');
                    panel.classList.add('is-open');
                    panel
                        .querySelector('.content')
                        .classList.remove('is-hidden');
                    panel.querySelector('.content').classList.add('is-open');
                    e.target.classList.add('is-selected');
                });
            });

            tabsPanel.forEach((tabPanel) => {
                tabPanel.addEventListener('click', function (e) {
                    const parent = e.target.parentElement;
                    if (parent.classList.contains('is-hidden')) {
                        parent.classList.remove('is-hidden');
                        parent.classList.add('is-open');
                    } else {
                        parent.classList.remove('is-open');
                        parent.classList.add('is-hidden');
                    }
                });
            });
            var resizeTabs = function () {
                tabsTrigger.forEach((el, i) => {
                    const tab = el.querySelector('a');
                    if (!tab) return;
                    if (i !== 0) {
                        tab.classList.remove('is-selected');
                    } else {
                        tab.classList.add('is-selected');
                    }
                });
                tabsPanel.forEach((el, i) => {
                    const content = el.querySelector('.content');
                    if (!content) return;
                    if (i !== 0) {
                        el.classList.remove('is-open');
                        el.classList.add('is-hidden');
                        content.classList.remove('is-open');
                        content.classList.add('is-hidden');
                    } else {
                        el.classList.remove('is-hidden');
                        el.classList.add('is-open');
                        content.classList.remove('is-hidden');
                        content.classList.add('is-open');
                    }
                });
            };

            window.addEventListener('resize', resizeTabs);
        });
    }
}
