# Dorik Monorepo (Builder)

## How to extract dynamic translation keys

To use the auto-translation feature, run the following command:

```sh
npm run extract:translation-keys
```

This will extract translatable code from `editor-resources` and create a `builder.json` file in the `locales/en` folder within Builder. The file will then be copied to the `public` folders of `main-dashboard` and `cms-dashboard`.

To update live when any changes are made to the `src/modules` of the `Builder`, run the following command:

```sh
npm run i18next:watch
```

This command will monitor the `src/modules` folder, and if you use the `t` function of `useTranslation` or `i18next.t`, the Builder JSON will be updated with a new key. For instance, if you use something like `t('hello world')`, then `hello world` will be added to the `builder.json` file and copied to both the `main-dashboard` and `cms-dashboard`. To know more about it [read more.](https://github.com/orgs/dorik/discussions/135)

## Important commands

-   If you are working with Builder translation, run the command `npm run i18next:watch` before making any changes, and all your changes will be tracked.
-   If you make any changes inside the `editor-resources` folder that you think should be translated, you need to manually run `npm run extract:translation-keys`. This command does not run in watch mode, so you need to run it manually every time you make changes that should be translated. Make as many changes as you want and finally run this command before committing and pushing the code to GitHub.
