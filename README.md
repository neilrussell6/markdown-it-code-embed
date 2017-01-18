MarkdownIt Code Embed
=====================

> Code embed plugin for [markdown-it](https://github.com/markdown-it/markdown-it) markdown parser.
> Allows you to add embeds from services like [Codepen](https://codepen.io/) to your markdown.

__requires `markdown-it` v5.+.__

Install
-------

```bash
npm install markdown-it-code-embed --save
```

Use
-----

##### in your script

```javascript
const md = require('markdown-it')();
md.use(require('markdown-it-code-embed'));
```

##### in your markdown

you can provide just the slug hash for your codepen embed like this:

```markdown
@[codepen](ABC)
```

or you can provide just the slug hash & pen title like this:

```markdown
@[codepen](ABC,My Pen)
```

or you can provide all the config options (must be valid json, and must be on a single line), like this:

```markdown
@[codepen]({"slug_hash":"ABC", "pen_title":"My Pen"})
```

##### Include required embed Javascript

This plugin does not attach the Javascript required by the embed service, so remember to include it.

Below are the required scripts for each supported service:

**codepen**

```
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
```

Config
------

Configs can be set directly in your markdown as per above examples, or passed in when markdown-it is told to use the plugin, like this:

```javascript
const md = require('markdown-it')();
md.use(require('markdown-it-code-embed'), {
    user: "johnsnow"
});
```

#### Codepen options

 * **height** (default = 265)
 * **theme_id** (default = dark)
 * **slug_hash** (default = null)
 * **default_tab** (default = result)
 * **user** (default = null)
 * **user_name** (default = null)
 * **embed_version** (default = 2)
 * **pen_title** (default = null)
 * **class** (default = codepen)
 * **palceholder** *accepts variables* (default = 
```html
See the Pen <a href="https://codepen.io/${user}/pen/${slug_hash}/">${pen_title}</a> by ${user_name} (<a href="http://codepen.io/${user}">@${user}</a>) on <a href="http://codepen.io">CodePen</a>.
```

License
-------

[MIT](https://github.com/neilrussell6/markdown-it-code-embed/blob/master/LICENSE)
