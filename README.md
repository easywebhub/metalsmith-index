#### Example config, array or an object
#### (note) root of indexPath is site root
  - `ref`: value used for key, default is 'filePath'
  - `fields`: ['title', 'description']
  - `fields`: '*' // all fields of content exclude('contents', 'mode', 'stats')
  - `indexPath`: `contentIndex.json`

#### add config to site.js bellow metalsmith-markdown
```
'metalsmith-index': [
		{
			indexPath: 'index.json',
			fields: [ 'title', 'description' ]
		}
	]
```