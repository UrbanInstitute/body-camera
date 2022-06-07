# Body-worn camera legislation tracker

This is structured a bit differently than most Urban features (it's quite old). Some notes:

Current feature is [here](https://apps.urban.org/features/body-camera-update/). this is on the `v3` branch
Old (deprecated) feature still exists, [here](https://apps.urban.org/features/body-camera/), this is on the `master` branch

_note: this branch structure could certainly be cleaned up/renamed to be more clear, just as long as apps and apps-staging were kept on the correct branches for both features (and this README updated)_

_note 2: the old feature (master branch) is broken, it uses an old Google sheets API instead of the current method using Papa.parse (see various tutorials online, such as [this](https://dev.to/bornfightcompany/using-google-sheets-as-a-simple-database-with-papa-parse-2k7o). As far as I know there is neither interest in nor budget for fixing it_

There's a lot of extraneous code and extraneous files in here from various former devs, apologies I haven't cleaned up. The feature is powered by a Google Sheet, so editing that sheet will edit the live feature. The sheet URL is found [here](https://github.com/UrbanInstitute/body-camera/blob/v3/js/bodycam.js#L30) (sheet is located by `data_id` var, which defaults to first tab, which powers the color of the heatmap cells, "blurb" tab (the tooltip text on mouseover) is powered by the second tab, defined by the `blurb_id` variable.

Majority of data changes (including copy edits to text) can be made by updating Google doc. Note that currently (as of 6/7/2022), the live version on the `apps` server is behind in commits, and pulls from a different, older Google doc. So updating the Google doc will only update the `apps-staging` version. Pulling to `apps` will deploy new Google doc.

**So to edit the blurbs, it's this url:
[https://docs.google.com/spreadsheets/d/1gxBY-61l5a0CYrP6G0cwCMWqvJ5_SEnrTGs1-N6kOIY/edit#gid=263941599](https://docs.google.com/spreadsheets/d/1gxBY-61l5a0CYrP6G0cwCMWqvJ5_SEnrTGs1-N6kOIY/edit#gid=263941599)**

**To edit the heatmap, it's this url:
[https://docs.google.com/spreadsheets/d/1gxBY-61l5a0CYrP6G0cwCMWqvJ5_SEnrTGs1-N6kOIY/edit#gid=0](https://docs.google.com/spreadsheets/d/1gxBY-61l5a0CYrP6G0cwCMWqvJ5_SEnrTGs1-N6kOIY/edit#gid=0)**

Also note that after editing the Google Doc, you must re "publish to web" via menus to make live!
